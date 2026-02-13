import yfinance as yf
import pandas as pd
import numpy as np
import json
import os
import time
from datetime import datetime, timedelta, timezone

# ==========================================
# CONFIGURATION
# ==========================================

# 1. Beacons Tickers (Core Macro Warnings)
BEACON_TICKERS = {
    "US10Y": "^TNX",
    "US3M": "^IRX",
    "VIX": "^VIX",
    "VIX3M": "^VIX3M",  
    "HY_BOND": "HYG",   
    "IG_BOND": "IEF"    
}

# 2. OGV Indicators (Enhanced Density: 24 total)
OGV_TICKERS = {
    # Macro Pillars
    "SPY": "SPY", "QQQ": "QQQ", "IWM": "IWM",
    "BTC": "BTC-USD", "GOLD": "GC=F", "US10Y": "^TNX",
    
    # Cash / Safe Haven (The "Moving Fortress" additions)
    "DXY": "DX-Y.NYB", "BIL": "BIL",
    
    # Sectors (Market Concentration)
    "XLK": "XLK", "XLE": "XLE", "XLF": "XLF", "XLV": "XLV", 
    "XLI": "XLI", "XLB": "XLB", "XLY": "XLY", "XLP": "XLP", 
    "XLU": "XLU", "XLRE": "XLRE",
    
    # Diversified / Global
    "EEM": "EEM", "FXI": "FXI", "USO": "USO", "SLV": "SLV",
    "JNK": "JNK", "TLT": "TLT"
}

# OGV Axis Weights (Defining the Economic/Monetary Geometry)
# X-Axis: Economy (+ Expansion / - Stagnation)
OGV_X_WEIGHTS = {
    "SPY": 1.0, "QQQ": 1.2, "IWM": 1.0, "BTC": 0.8, "COPPER": 1.0,
    "XLK": 1.2, "XLY": 1.0, "XLF": 0.8, "XLI": 0.8, "XLE": 0.5,
    "EEM": 0.8, "FXI": 0.6, "USO": 0.5,
    "GOLD": -1.0, "DXY": -1.2, "BIL": -1.5, "XLP": -0.8, "XLV": -0.6, "XLU": -0.8, "TLT": -0.5
}

# Y-Axis: Monetary (+ Tightening / - Liquidity)
OGV_Y_WEIGHTS = {
    "US10Y": 1.5, "DXY": 1.0, "BIL": 0.8, "XLF": 0.6,
    "TLT": -1.5, "LQD": -1.2, "JNK": -1.0, "BTC": -0.5, "XLK": -0.4, "XLRE": -0.8, "XLU": -0.8
}

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "backend")
FRONTEND_DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "frontend/public/data")
MARKET_DATA_FILE = os.path.join(FRONTEND_DATA_DIR, "market_data.json")

def fetch_data():
    """Unified Fetcher using yfinance."""
    all_tickers = list(set(list(BEACON_TICKERS.values()) + list(OGV_TICKERS.values())))
    print(f"[FETCH] Starting batch download for {len(all_tickers)} tickers...")
    
    # Fetch 250 days to ensure enough context for Z-Score and 60-day trails
    data = yf.download(all_tickers, period="1y", interval="1d", progress=False)
    
    if isinstance(data.columns, pd.MultiIndex):
        try:
            data = data['Adj Close']
        except KeyError:
            data = data['Close']
            
    return data

def calculate_beacons(df):
    """Calculates the 3 warning beacons."""
    beacons = {}
    try:
        # 1. Recession Beacon
        us10y = df[BEACON_TICKERS['US10Y']].ffill().iloc[-1]
        us3m = df[BEACON_TICKERS['US3M']].ffill().iloc[-1]
        if us10y > 20: us10y /= 10
        if us3m > 20: us3m /= 10
        curve = us10y - us3m
        status = "safe"
        if curve < -0.5: status = "danger"
        elif curve < 0: status = "warning"
        beacons["recession"] = {"name": "Recession (Yield Curve)", "value": round(curve, 3), "status": status, "display": f"{round(curve, 2)}%"}

        # 2. Panic Beacon
        vix = df[BEACON_TICKERS['VIX']].ffill().iloc[-1]
        vxv = df[BEACON_TICKERS['VIX3M']].ffill().iloc[-1]
        ratio = vix / vxv if vxv > 0 else 1.0
        status = "safe"
        if ratio > 1.1: status = "danger"
        elif ratio > 0.95: status = "warning"
        beacons["panic"] = {"name": "Panic (VIX/VIX3M)", "value": round(ratio, 3), "status": status, "display": f"{round(ratio, 2)}x"}

        # 3. Credit Beacon
        hyg = df[BEACON_TICKERS['HY_BOND']].ffill()
        ief = df[BEACON_TICKERS['IG_BOND']].ffill()
        ratio_series = (hyg / ief).ffill()
        window = 120
        z_score = (ratio_series.iloc[-1] - ratio_series.rolling(window).mean().iloc[-1]) / ratio_series.rolling(window).std().iloc[-1]
        status = "safe"
        if z_score < -2.0: status = "danger"
        elif z_score < -1.2: status = "warning"
        beacons["credit"] = {"name": "Credit (HYG/IEF Z)", "value": round(z_score, 2), "status": status, "display": f"{round(z_score, 1)}σ"}
    except Exception as e:
        print(f"[ERROR] Beacon calculation: {e}")
    return beacons

def calculate_ogv(df):
    """Calculates the OGV core vector (60-day trail) and 24 satellite beacons."""
    trails = []
    satellites = []
    
    try:
        # Pre-process
        mapped_df = pd.DataFrame()
        for name, ticker in OGV_TICKERS.items():
            if ticker in df.columns:
                mapped_df[name] = df[ticker]
        
        mapped_df = mapped_df.ffill().bfill()
        # Normalization over 120-day regime context
        norm_mean = mapped_df.rolling(120).mean()
        norm_std = mapped_df.rolling(120).std()
        z_scores = ((mapped_df - norm_mean) / norm_std).clip(-3, 3)
        
        # 1. Calculate 60-day Trail (Main Vector)
        history_len = 60
        valid_dates = z_scores.index[-history_len:]
        
        for date in valid_dates:
            row = z_scores.loc[date]
            x_val = sum(row[a] * w for a, w in OGV_X_WEIGHTS.items() if a in row) / sum(abs(w) for a, w in OGV_X_WEIGHTS.items() if a in row)
            y_val = sum(row[a] * w for a, w in OGV_Y_WEIGHTS.items() if a in row) / sum(abs(w) for a, w in OGV_Y_WEIGHTS.items() if a in row)
            
            trails.append({
                "date": date.strftime('%Y-%m-%d'),
                "x": round(x_val * 100, 2),
                "y": round(y_val * 100, 2)
            })
            
        # 2. Calculate Current Satellites (24 indicators)
        if len(valid_dates) > 0:
            latest_row = z_scores.iloc[-1]
            SCALAR = 45.0 # Spread on 100x100 grid
            for name in latest_row.index:
                w_x = OGV_X_WEIGHTS.get(name, 0)
                w_y = OGV_Y_WEIGHTS.get(name, 0)
                satellites.append({
                    "id": name,
                    "label": name,
                    "x": round(latest_row[name] * w_x * SCALAR, 2),
                    "y": round(latest_row[name] * w_y * SCALAR, 2),
                    "z": round(latest_row[name], 2)
                })
                
    except Exception as e:
        print(f"[ERROR] OGV calculation: {e}")
        
    return trails, satellites

def check_alert_conditions(current_beacons, previous_beacons):
    """
    Detect status changes to danger/warning for alerting.
    
    Args:
        current_beacons: Current beacon data
        previous_beacons: Previous beacon data
    
    Returns:
        list: Alerts that need to be published
    """
    alerts = []
    
    if not previous_beacons:
        return alerts
    
    for beacon_name in ["recession", "panic", "credit"]:
        current = current_beacons.get(beacon_name, {})
        previous = previous_beacons.get(beacon_name, {})
        
        current_status = current.get("status", "safe")
        previous_status = previous.get("status", "safe")
        
        # Alert only when status worsens
        if current_status in ["danger", "warning"] and current_status != previous_status:
            alerts.append({
                "beacon": beacon_name,
                "status": current_status,
                "value": current.get("value"),
                "display": current.get("display"),
                "name": current.get("name")
            })
    
    return alerts


def main():
    print(f"=== OGV MOVING FORTRESS UPDATE [{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}] ===")
    
    # 1. Load Existing Data to Preserve Keys
    current_data = {}
    if os.path.exists(MARKET_DATA_FILE):
        try:
            with open(MARKET_DATA_FILE, 'r', encoding='utf-8') as f:
                current_data = json.load(f)
        except Exception as e:
            print(f"[WARN] Failed to read {MARKET_DATA_FILE}: {e}")

    # Ensure market_data exists to prevent frontend crash
    if "market_data" not in current_data:
        current_data["market_data"] = {}

    # 2. Fetch & Calculate
    df = fetch_data()
    if df.empty: return

    beacons = calculate_beacons(df)
    trails, satellites = calculate_ogv(df)
    
    # 3. Historical Data Tracking (30 days)
    timestamp = datetime.now(timezone.utc).isoformat()
    
    # Load existing history
    beacons_history = current_data.get("beacons_history", [])
    
    # Add new entry
    history_entry = {
        "timestamp": timestamp,
        "recession": {
            "value": beacons["recession"]["value"],
            "status": beacons["recession"]["status"]
        },
        "panic": {
            "value": beacons["panic"]["value"],
            "status": beacons["panic"]["status"]
        },
        "credit": {
            "value": beacons["credit"]["value"],
            "status": beacons["credit"]["status"]
        }
    }
    beacons_history.append(history_entry)
    
    # Prune to 30 days (720 hours max)
    if len(beacons_history) > 720:
        beacons_history = beacons_history[-720:]
    
    # 4. Alert Detection
    previous_beacons = current_data.get("beacons", {})
    alerts = check_alert_conditions(beacons, previous_beacons)
    
    if alerts:
        # Save alerts for SNS publisher
        alert_file = os.path.join(os.path.dirname(__file__), "beacon_alerts.json")
        alert_data = {
            "timestamp": timestamp,
            "alerts": alerts
        }
        try:
            with open(alert_file, 'w', encoding='utf-8') as f:
                json.dump(alert_data, f, indent=4, ensure_ascii=False)
            print(f"[ALERT] Generated {len(alerts)} beacon alerts: {alert_file}")
        except Exception as e:
            print(f"[ERROR] Failed to save alerts: {e}")
    
    # 5. Merge Updates
    current_data["last_updated"] = timestamp
    current_data["beacons"] = beacons
    current_data["beacons_history"] = beacons_history
    current_data["ogv"] = {
        "trails": trails,
        "current_vector": trails[-1] if trails else {"x": 50, "y": 50},
        "current_satellites": satellites,
        "history_length": 60,
        "system": "moving_fortress"
    }
    
    # Ensure frontend directories exist
    os.makedirs(os.path.dirname(MARKET_DATA_FILE), exist_ok=True)
    
    # 6. Save
    with open(MARKET_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(current_data, f, indent=4, ensure_ascii=False)
        
    print(f"[SUCCESS] {MARKET_DATA_FILE} updated. Preserved existing keys: {list(current_data.keys())}")
    print(f"[INFO] Beacons history: {len(beacons_history)} entries (~{len(beacons_history)/24:.1f} days)")

if __name__ == "__main__":
    main()
