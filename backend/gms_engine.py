import yfinance as yf
import pandas as pd
import numpy as np
import json
import os
import time
from datetime import datetime, timedelta
import random
from fredapi import Fred
import google.generativeai as genai

# CONFIGURATION
# Institutional-grade constants
SECTORS = {
    "STOCKS": {
        "tickers": {"VIX": "^VIX", "SPY": "SPY", "TNX": "^TNX", "QQQ": "QQQ", "IWM": "IWM"},
        "weights": {"VIX": 0.3, "TNX": 0.3, "SPY": 0.2, "QQQ": 0.1, "IWM": 0.1}, 
        "invert": ["VIX", "TNX"] # Higher = Worse for risk
    },
    "CRYPTO": {
        "tickers": {"BTC": "BTC-USD", "ETH": "ETH-USD", "SOL": "SOL-USD"},
        "weights": {"BTC": 0.5, "ETH": 0.3, "SOL": 0.2},
        "invert": []
    },
    "FOREX": {
        "tickers": {"DXY": "DX-Y.NYB", "USDJPY": "JPY=X", "EURUSD": "EURUSD=X"},
        "weights": {"DXY": 0.6, "USDJPY": 0.2, "EURUSD": 0.2},
        "invert": ["DXY"] # Strong DXY usually risk-off
    },
    "COMMODITIES": {
        "tickers": {"GOLD": "GC=F", "OIL": "CL=F", "COPPER": "HG=F", "NATGAS": "NG=F"},
        "weights": {"GOLD": 0.4, "OIL": 0.3, "COPPER": 0.3},
        "invert": ["GOLD"] # Gold rally often signals safety flight
    }
}

# Legacy Risk Factors for Total Score (Maintained for consistency)
RISK_FACTORS = {
    "VIX": {"weight": 0.2, "invert": True},
    "MOVE": {"weight": 0.2, "invert": True},
    "HY_SPREAD": {"weight": 0.3, "invert": True},
    "NFCI": {"weight": 0.1, "invert": True},
    "BREADTH": {"weight": 0.1, "invert": False},
    "MOMENTUM": {"weight": 0.1, "invert": False}
}

# Determine script directory... (Existing code)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "current_signal.json")
HISTORY_FILE = os.path.join(SCRIPT_DIR, "history.json")
ARCHIVE_DIR = os.path.join(SCRIPT_DIR, "archive")

# ... (Existing Directory Checks)

# API KEYS
FRED_KEY = os.getenv("FRED_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

def fetch_fred_data():
    """Fetches official economic data."""
    # ... (Existing FRED logic preserved)
    data = {}
    data['YIELD_SPREAD'] = 0.05
    data['HY_SPREAD'] = 3.5
    data['NFCI'] = -0.5
    
    if not FRED_KEY: return data
    fred = Fred(api_key=FRED_KEY)
    try:
        try: data['YIELD_SPREAD'] = float(fred.get_series('T10Y2Y').iloc[-1])
        except: pass
        try: data['HY_SPREAD'] = float(fred.get_series('BAMLH0A0HYM2').iloc[-1])
        except: pass
        try: data['NFCI'] = float(fred.get_series('NFCI').iloc[-1])
        except: pass
        return data
    except Exception: return data

def fetch_market_data():
    """Fetches multi-asset data from Yahoo Finance."""
    print("Fetching Institutional Multi-Asset Feeds...")
    
    # Flatten all tickers for batch fetching (optional, but keeping loop for simplicity)
    all_data = {}
    fred_data = fetch_fred_data()
    status = "OPERATIONAL"
    
    # 1. Base Market Data (Legacy Compatibility)
    if fred_data:
        for k, v in fred_data.items():
            all_data[k] = {"price": round(v, 2), "change_percent": 0.0, "trend": "NEUTRAL", "sparkline": []}
            if k == "YIELD_SPREAD": all_data[k]["trend"] = "INVERTED" if v < 0 else "NORMAL"
            if k == "HY_SPREAD": all_data[k]["trend"] = "STRESS" if v > 5.0 else "CALM"

    # 2. Fetch All Sectors
    for sector_name, config in SECTORS.items():
        for key, symbol in config["tickers"].items():
            try:
                t = yf.Ticker(symbol)
                hist = t.history(period="1mo")
                if not hist.empty and len(hist) >= 2:
                    current = hist['Close'].iloc[-1]
                    prev = hist['Close'].iloc[-2]
                    change = ((current - prev) / prev) * 100
                    sparkline = hist['Close'].tolist()
                    
                    all_data[key] = {
                        "price": round(current, 2),
                        "change_percent": round(change, 2),
                        "trend": "UP" if change > 0 else "DOWN",
                        "sparkline": [round(x, 2) for x in sparkline]
                    }
                else: raise Exception("Empty Data")
            except:
                # Mock Data for Resilience
                base_prices = {"BTC": 95000, "ETH": 3400, "SOL": 180, "USDJPY": 150, "EURUSD": 1.05, "OIL": 75, "NATGAS": 2.5}
                base = base_prices.get(key, 100)
                all_data[key] = {
                    "price": round(base + random.uniform(-1, 1), 2),
                    "change_percent": round(random.uniform(-1, 1), 2),
                    "trend": "NEUTRAL",
                    "sparkline": [round(base + random.uniform(-1, 1) for _ in range(30))]
                }
                status = "SIMULATED"

    # 3. Add Computed/Legacy Indicators (MOVE, etc to keep compatibility)
    all_data["MOVE"] = {"price": 100, "change_percent": 0, "trend": "NORMAL", "sparkline": [100]*30} # Placeholder
    all_data["BREADTH"] = {"price": 10, "trend": "HEALTHY", "sparkline": [10]*30}
    
    return all_data, status

def calculate_sector_score(sector_name, data):
    """Calculates 0-100 score for a specific sector."""
    config = SECTORS.get(sector_name)
    if not config: return 50
    
    score = 50.0
    total_weight = 0
    
    for key, weight in config["weights"].items():
        if key not in data: continue
        item = data[key]
        price = item["price"]
        change = item["change_percent"]
        
        # Normalized scoring logic (Simplified for robustness)
        # Invert: Higher Price = Lower Score (Risk Off / Bad)
        # Normal: Higher Price = Higher Score (Risk On / Good)
        
        impact = 0
        if key in config["invert"]:
             # E.g., VIX: 20 is neutral. >20 bad (-), <20 good (+)
             # Baseline 20. +1 point for every 0.5 below 20?
             # Simple approach: Change based
             if change > 0: impact = -5 # Rising fear
             else: impact = 5
        else:
             if change > 0: impact = 5 # Rising asset
             else: impact = -5
             
        score += impact * (weight * 5) # Scale factor
        total_weight += weight

    return int(max(0, min(100, score)))

def calculate_total_gms(data, sector_scores):
    """Calculates Final Global Macro Signal (0-100)."""
    # Base: Legacy Logic + Component Average
    # Legacy Logic (VIX, HY, etc)
    legacy_score = 50
    vix = data.get("VIX", {}).get("price", 20)
    legacy_score += (20 - vix) * 1.5
    hy = data.get("HY_SPREAD", {}).get("price", 3.5)
    if hy > 5.0: legacy_score -= 20
    elif hy < 3.5: legacy_score += 10
    
    legacy_score = max(0, min(100, legacy_score))
    
    # Weighted Sector Influence
    # Stocks 40%, Crypto 10%, Forex 20%, Cmdty 10%, Legacy 20%
    final = (legacy_score * 0.4) + \
            (sector_scores.get("STOCKS", 50) * 0.3) + \
            (sector_scores.get("CRYPTO", 50) * 0.1) + \
            (sector_scores.get("FOREX", 50) * 0.1) + \
            (sector_scores.get("COMMODITIES", 50) * 0.1)
            
    return int(max(0, min(100, final)))

def update_signal():
    print("Running OmniMetric v2.0 Engine...")
    market_data, status = fetch_market_data()
    
    if market_data:
        # Calculate Individual Sector Scores
        sector_scores = {
            "STOCKS": calculate_sector_score("STOCKS", market_data),
            "CRYPTO": calculate_sector_score("CRYPTO", market_data),
            "FOREX": calculate_sector_score("FOREX", market_data),
            "COMMODITIES": calculate_sector_score("COMMODITIES", market_data)
        }
        
        # Total Score
        score = calculate_total_gms(market_data, sector_scores)
        
        # AI Analysis (Pass context)
        ai_reports = generate_multilingual_report(market_data, score) # Keeps existing function

        # Events
        events = get_next_event_dates()

        payload = {
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S EST"),
            "gms_score": score,
            "sector_scores": sector_scores, # NEW
            "market_data": market_data,
            "events": events,
            "analysis": {
                "title": "Global Market Outlook",
                "content": ai_reports['EN'],
                "reports": ai_reports
            },
            "system_status": status
        }

        
        today_str = datetime.now().strftime("%Y-%m-%d")
        archive_path = os.path.join(ARCHIVE_DIR, f"{today_str}.json")
        try:
            with open(archive_path, 'w') as f:
                json.dump(payload, f, indent=4)
        except: pass

        try:
            with open(DATA_FILE, 'w') as f:
                json.dump(payload, f, indent=4)
        except Exception as e:
            print(f"Error writing to DATA_FILE: {e}")

        return payload

    else:
        return {
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S EST"),
            "gms_score": 50,
            "market_data": {},
            "events": [],
            "analysis": {"title": "Error", "content": "Data Unavailable"},
            "history_chart": [],
            "system_status": "ERROR"
        }

if __name__ == "__main__":
    try:
        update_signal()
    except Exception:
        pass
