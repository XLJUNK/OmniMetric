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
import requests
from dotenv import load_dotenv
import subprocess
import re
import requests
import xml.etree.ElementTree as ET

# Load environment variables from all possible locations
load_dotenv() # CWD
load_dotenv(os.path.join(os.path.dirname(__file__), '.env')) # backend/.env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')) # root/.env

# Update keys after loading
FRED_KEY = os.getenv("FRED_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
FMP_KEY = os.getenv("FMP_API_KEY")

# CONFIGURATION
# Institutional-grade constants
SECTORS = {
    "STOCKS": {
        "tickers": {"VIX": "^VIX", "SPY": "SPY", "TNX": "^TNX", "QQQ": "QQQ", "IWM": "IWM", "RSP": "RSP", "HYG": "HYG", "NIFTY": "^NSEI"},
        "weights": {"VIX": 0.2, "TNX": 0.2, "SPY": 0.1, "QQQ": 0.1, "IWM": 0.1, "RSP": 0.1, "HYG": 0.1, "NIFTY": 0.1}, 
        "invert": ["VIX", "TNX"] 
    },
    "CRYPTO": {
        "tickers": {"BTC": "BTC-USD", "ETH": "ETH-USD", "SOL": "SOL-USD"},
        "weights": {"BTC": 0.5, "ETH": 0.3, "SOL": 0.2},
        "invert": []
    },
    "FOREX": {
        "tickers": {"DXY": "DX-Y.NYB", "USDJPY": "JPY=X", "EURUSD": "EURUSD=X", "USDINR": "INR=X", "USDSAR": "SAR=X"},
        "weights": {"DXY": 0.4, "USDJPY": 0.2, "EURUSD": 0.2, "USDINR": 0.1, "USDSAR": 0.1},
        "invert": ["DXY", "USDINR", "USDSAR"]
    },
    "COMMODITIES": {
        "tickers": {"GOLD": "GC=F", "OIL": "CL=F", "COPPER": "HG=F", "NATGAS": "NG=F"},
        "weights": {"GOLD": 0.4, "OIL": 0.3, "COPPER": 0.3},
        "invert": ["GOLD"]
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
FMP_KEY = os.getenv("FMP_API_KEY")
AI_GATEWAY_KEY = os.getenv("AI_GATEWAY_API_KEY")

def validate_api_keys():
    """Validates presence of required API keys and logs warnings for missing ones."""
    missing = []
    if not FRED_KEY: missing.append("FRED_API_KEY")
    if not GEMINI_KEY: missing.append("GEMINI_API_KEY")
    if not FMP_KEY: missing.append("FMP_API_KEY")
    if not AI_GATEWAY_KEY: missing.append("AI_GATEWAY_API_KEY")
    
    if missing:
        print(f"--- [ADMIN ALERT] MISSING API KEYS: {', '.join(missing)} ---")
        print("System will operate in SIMULATED/FALLBACK mode for affected modules.")
    else:
        print("--- [SYSTEM] ALL API KEYS VALIDATED ---")
    return len(missing) == 0

def fetch_net_liquidity(fred):
    """Calculates US Net Liquidity = Fed Assets - TGA - RRP."""
    try:
        # WALCL: Federal Reserve Total Assets
        # WTREGEN: Treasury General Account (TGA)
        # RRPONTSYD: Overnight Reverse Repurchase Agreements (RRP)
        
        walcl = float(fred.get_series('WALCL').iloc[-1])
        tga = float(fred.get_series('WTREGEN').iloc[-1])
        rrp = float(fred.get_series('RRPONTSYD').iloc[-1])
        
        # Convert to Billions for readability if in Millions (FRED series units vary)
        # WALCL is usually Millions. TGA/RRP Millions or Billions.
        # Assuming all in Millions, convert to Trillions for display? 
        # Actually, let's keep raw for calculation and scale for display.
        # WALCL (Millions), WTREGEN (Billions), RRPONTSYD (Billions) - NEED TO CHECK UNITS
        # Official FRED Units: WALCL (Millions), WTREGEN (Billions), RRPONTSYD (Billions)
        
        net_liq = (walcl / 1000) - tga - rrp # All in Billions
        
        return {
            "price": round(net_liq, 2), # In Billions
            "change_percent": 0.0, # Todo: calc change
            "trend": "EXPANSION" if net_liq > 6000 else "CONTRACTION", # Arbitrary baseline
            "sparkline": [round(net_liq, 2)] * 30 
        }
    except Exception as e:
        print(f"Net Liquidity Error: {e}")
        return {"price": 0, "change_percent": 0, "trend": "ERROR", "sparkline": []}

def fetch_fred_data():
    """Fetches official economic data."""
    # ... (Existing FRED logic preserved)
    data = {}
    data['YIELD_SPREAD'] = 0.05
    data['HY_SPREAD'] = 3.5
    data['NFCI'] = -0.5
    data['NET_LIQUIDITY'] = {"price": 6200, "change_percent": 0, "trend": "NEUTRAL", "sparkline": [6200] * 30}
    
    # Try to load previous data for fallbacks
    previous_data = {}
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                saved = json.load(f)
                previous_data = saved.get('market_data', {})
    except: pass

    # Fetch Historical Data (Last 90 days to ensure clean data for weekly series)
    start_date = (datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d')
    
    if not FRED_KEY: return data

    fred = Fred(api_key=FRED_KEY)
    try:
        # 1. YIELD SPREAD (10Y-2Y)
        try: 
            series = fred.get_series('T10Y2Y', observation_start=start_date)
            data['YIELD_SPREAD_10Y2Y'] = float(series.iloc[-1]) # Keep for reference
        except: pass

        # 1-B. YIELD SPREAD (10Y-3M) - PRIMARY
        try:
            series_3m = fred.get_series('T10Y3M', observation_start=start_date)
            current_3m = float(series_3m.iloc[-1])
            data['YIELD_SPREAD'] = current_3m # Main Metric Overwrite
        except: 
            if 'YIELD_SPREAD' in previous_data: data['YIELD_SPREAD'] = previous_data['YIELD_SPREAD']

        # 2. HY SPREAD (BAMLH0A0HYM2)
        try:
            hy_series = fred.get_series('BAMLH0A0HYM2', observation_start=start_date)
            hy_series = hy_series.ffill()
            current_hy = float(hy_series.iloc[-1])
            hy_spark = hy_series.tail(30).tolist()
            # If less than 30, pad
            if len(hy_spark) < 30: hy_spark = [current_hy] * (30 - len(hy_spark)) + hy_spark
            
            data['HY_SPREAD'] = {
                "price": current_hy,
                "change_percent": 0.0, # Todo
                "trend": "STRESS" if current_hy > 5.0 else "CALM",
                "sparkline": [round(x, 2) for x in hy_spark]
            }
        except: 
             if 'HY_SPREAD' in previous_data: data['HY_SPREAD'] = previous_data['HY_SPREAD']

        # 3. NFCI
        try: data['NFCI'] = float(fred.get_series('NFCI').iloc[-1])
        except: 
            if 'NFCI' in previous_data: data['NFCI'] = previous_data['NFCI']
        
        # 4. NET LIQUIDITY (WALCL - WTREGEN - RRPONTSYD)
        try:
            # Align dates. WALCL is Weekly. Others daily.
            walcl = fred.get_series('WALCL', observation_start=start_date)
            tga = fred.get_series('WTREGEN', observation_start=start_date)
            rrp = fred.get_series('RRPONTSYD', observation_start=start_date)
            
            # Create DataFrame to forward fill WALCL
            df = pd.DataFrame({'WALCL': walcl, 'TGA': tga, 'RRP': rrp})
            
            # Resilience: Check if we have enough data to proceed
            if df.empty or 'WALCL' not in df or df['WALCL'].dropna().empty:
                raise Exception("Insufficient FRED data for Liquidity components")

            # Ensure all values are numeric and fill NaNs. 
            # We use ffill() so daily dates get the last weekly value.
            # Then bfill() to fill any leading NaNs from different start dates.
            df = df.apply(pd.to_numeric, errors='coerce').ffill().bfill().fillna(0)
            
            # Correct Logic: WALCL (M), TGA (M), RRP (B)
            # Result: Billions
            df['NET_LIQ'] = (df['WALCL'] - df['TGA'] - (df['RRP'] * 1000)) / 1000
            
            last_val = df['NET_LIQ'].iloc[-1]
            
            # EMERGENCY: Check for NaN or suspiciously low value (e.g. < 1000, as it should be ~5000+)
            if pd.isna(last_val) or last_val < 1000:
                print(f"Net Liquidity Calculation suspicious ({last_val}). Trying to recover from cache.")
                if 'NET_LIQUIDITY' in previous_data and previous_data['NET_LIQUIDITY'].get('price', 0) > 1000:
                     data['NET_LIQUIDITY'] = previous_data['NET_LIQUIDITY']
                     return data
                else:
                    last_val = 6200.0 if not pd.isna(last_val) and last_val > 0 else 6200.0

            spark = df['NET_LIQ'].tail(30).tolist()
            
            # Handle list with too few items
            if len(spark) < 30:
                spark = [last_val] * (30 - len(spark)) + spark

            change = 0.0
            if len(spark) > 5 and spark[-5] != 0:
                change = ((spark[-1] - spark[-5]) / spark[-5]) * 100
            elif len(spark) > 1 and spark[-2] != 0:
                change = ((spark[-1] - spark[-2]) / spark[-2]) * 100

            data['NET_LIQUIDITY'] = {
                "price": round(last_val, 2), # Billions
                "change_percent": round(change, 2),
                "trend": "EXPANSION" if last_val > 5500 else "CONTRACTION",
                "sparkline": [round(x, 2) for x in spark]
            }
        except Exception as e:
            print(f"Net Liq Calc Error: {e}")
            if 'NET_LIQUIDITY' in previous_data and previous_data['NET_LIQUIDITY'].get('price', 0) > 1000:
                 print("Recovered Net Liquidity from cache.")
                 data['NET_LIQUIDITY'] = previous_data['NET_LIQUIDITY']
            else:
                 data['NET_LIQUIDITY'] = {"price": 6200, "change_percent": 0, "trend": "NEUTRAL", "sparkline": [6200] * 30}
        
        return data
    except Exception: return data

def fetch_crypto_sentiment():
    """FETCH CRYPTO FEAR & GREED INDEX (Free API)"""
    try:
        url = "https://api.alternative.me/fng/?limit=30"
        response = requests.get(url, timeout=5)
        data = response.json()
        if data and "data" in data and len(data["data"]) > 0:
            sparkline = [int(x["value"]) for x in reversed(data["data"])]
            val = int(data["data"][0]["value"])
            # Normalize to GMS Trend
            trend = "NEUTRAL"
            if val < 25: trend = "FEAR"
            elif val > 75: trend = "GREED"
            elif val > 55: trend = "BULLISH"
            elif val < 45: trend = "BEARISH"
            
            return {
                "price": val,
                "change_percent": 0.0, # Could calc from sparkline
                "trend": trend,
                "sparkline": sparkline
            }
    except Exception as e:
        print(f"[Warn] Crypto F&G Error: {e}")
    return None


def fetch_economic_calendar():
    """FETCH ECONOMIC CALENDAR FROM FMP (Real Data)"""
    try:
        api_key = FMP_KEY
        if not api_key:
            return [] # No hardcoded fallback - wait for environment to be ready
            
        # Get events for next 7 days
        start_date = datetime.now().strftime("%Y-%m-%d")
        end_date = (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d")
        
        url = f"https://financialmodelingprep.com/api/v3/economic_calendar?from={start_date}&to={end_date}&apikey={api_key}"
        response = requests.get(url, timeout=5)
        data = response.json()
        
        events = []
        if isinstance(data, list):
            # Prioritize High Impact, USD/EUR/CNY/JPY
            priority_currencies = ["USD", "EUR", "CNY", "JPY"]
            
            count = 0
            for item in data:
                if count >= 3: break # Limit to top 3
                
                impact = str(item.get("impact", "")).lower()
                currency = item.get("currency", "")
                
                # Filter: High/Medium impact AND Priority Currency
                if (impact in ["high", "medium"]) and (currency in priority_currencies):
                    # Format Date
                    event_date_str = item.get("date", "") # "2026-01-14 08:30:00"
                    try:
                        dt = datetime.strptime(event_date_str, "%Y-%m-%d %H:%M:%S")
                        formatted_date = dt.strftime("%Y-%m-%d")
                        formatted_time = dt.strftime("%H:%M") + " EST"
                        day_str = dt.strftime("%a").upper()
                    except:
                        formatted_date = event_date_str[:10]
                        formatted_time = ""
                        day_str = ""

                    events.append({
                        "code": "generic", # Dictionary will fallback to name if code not found
                        "name": f"{currency} {item.get('event', 'Event')}",
                        "date": formatted_date,
                        "day": day_str,
                        "time": formatted_time,
                        "impact": "critical" if impact == "high" else "high"
                    })
                    count += 1
        return events
    except Exception as e:
        print(f"[Warn] Calendar Error: {e}")
        return []

def fetch_market_data():
    """Fetches multi-asset data from Yahoo Finance."""
    print("Fetching Institutional Multi-Asset Feeds...")
    
    all_data = {}
    
    # 0. CRYPTO SENTIMENT (New)
    crypto_fg = fetch_crypto_sentiment()
    if crypto_fg:
        all_data["CRYPTO_SENTIMENT"] = crypto_fg
    else:
        all_data["CRYPTO_SENTIMENT"] = {"price": 50, "change_percent": 0.0, "trend": "NEUTRAL", "sparkline": [50]*30}
    
    # 0.5 ECONOMIC CALENDAR (Real)
    real_events = fetch_economic_calendar()

    # Flatten all tickers for batch fetching (optional, but keeping loop for simplicity)
    # all_data = {} # Removed duplicate
    fred_data = fetch_fred_data()
    status = "OPERATIONAL"
    
    # ... (Rest of fetch logic) ...
    # Skip lines until "events" construction
    
    # We will inject real_events at the end of function

    
    # 1. Base Market Data (Legacy Compatibility)
    if fred_data:
        for k, v in fred_data.items():
            if isinstance(v, dict): continue # skip complex types, handled later
            all_data[k] = {"price": round(v, 2), "change_percent": 0.0, "trend": "NEUTRAL", "sparkline": [v]*30}
            if k == "YIELD_SPREAD": all_data[k]["trend"] = "INVERTED" if v < 0 else "NORMAL"
            # HY_SPREAD is now complex, handled below
        if 'HY_SPREAD' in fred_data:
             if isinstance(fred_data['HY_SPREAD'], dict):
                 all_data['HY_SPREAD'] = fred_data['HY_SPREAD']
             else:
                 # Fallback if scalar
                 val = fred_data['HY_SPREAD']
                 all_data['HY_SPREAD'] = {"price": round(val, 2), "change_percent": 0.0, "trend": "STRESS" if val > 5 else "CALM", "sparkline": [val]*30}

        # Add Net Liquidity directly
        if 'NET_LIQUIDITY' in fred_data:
             all_data['NET_LIQUIDITY'] = fred_data['NET_LIQUIDITY']

    # 2. Fetch All Sectors using Batch for Speed
    all_tickers = []
    for sector_name, config in SECTORS.items():
        all_tickers.extend(config["tickers"].values())
    
    # Also include MOVE and any other YF tickers
    all_tickers.extend(["^MOVE", "SPY", "RSP"]) # Ensure these are included
    all_tickers = list(set(all_tickers))

    try:
        batch_hist = yf.download(all_tickers, period="3mo", group_by='ticker', silent=True)
    except:
        batch_hist = None

    for sector_name, config in SECTORS.items():
        for key, symbol in config["tickers"].items():
            try:
                hist = batch_hist[symbol] if batch_hist is not None else yf.Ticker(symbol).history(period="3mo")
                if not hist.empty:
                    # Clear out potential MultiIndex issues
                    if isinstance(hist.columns, pd.MultiIndex):
                        hist = hist.droplevel(0, axis=1) if 'Close' in hist.columns.levels[0] else hist # redundant check
                    
                    hist_close = hist['Close'].dropna()
                    if not hist_close.empty:
                        hist_1mo = hist_close.tail(22)
                        current = hist_close.iloc[-1]
                        
                        # Calculate 5-day change
                        prev_5_day = hist_close.iloc[-5] if len(hist_close) >= 5 else hist_close.iloc[0]
                        change = ((current - prev_5_day) / prev_5_day) * 100 if prev_5_day != 0 else 0
                        
                        all_data[key] = {
                            "price": round(current, 2),
                            "change_percent": round(change, 2),
                            "trend": "UP" if change > 0 else "DOWN",
                            "sparkline": [round(x, 2) for x in hist_1mo.tolist()]
                        }
                    else: raise Exception("No close data")
                else: raise Exception("Empty Data")
            except:
                # Mock Data for Resilience
                base_prices = {"BTC": 95000, "ETH": 3400, "SOL": 180, "USDJPY": 150, "EURUSD": 1.05, "OIL": 75, "NATGAS": 2.5, "USDINR": 87.50, "USDSAR": 3.75, "RSP": 170, "HYG": 77, "VIX": 15, "NIFTY": 23500}
                base = base_prices.get(key, 100)
                sim_price = round(base + random.uniform(-1, 1), 2)
                all_data[key] = {
                    "price": sim_price,
                    "change_percent": round(random.uniform(-1, 1), 2),
                    "trend": "NEUTRAL",
                    "sparkline": [round(base + random.uniform(-1, 1), 2) for _ in range(30)]
                }
                status = "SIMULATED"

    # 3. Add Computed/Legacy Indicators
    
    # LIVE MOVE INDEX (Try ^MOVE or ^TYVIX)
    try:
        move = yf.Ticker("^MOVE") 
        hist = move.history(period="1mo")
        if hist.empty:
            move = yf.Ticker("^TYVIX") # CBOE 10Y Treasury Note Volatility (MOVE Proxy)
            hist = move.history(period="1mo")
            
        if not hist.empty:
            current = hist['Close'].iloc[-1]
            prev = hist['Close'].iloc[-2] if len(hist) > 1 else current
            change = ((current - prev) / prev) * 100
            sparkline = hist['Close'].tolist()
            trend = "ELEVATED" if current > 120 else ("STRESS" if current > 140 else "NORMAL")
            
            all_data["MOVE"] = {
                "price": round(current, 2), 
                "change_percent": round(change, 2), 
                "trend": trend, 
                "sparkline": [round(x, 2) for x in sparkline]
            }
        else:
             all_data["MOVE"] = {"price": 105.2, "change_percent": 1.2, "trend": "MOCK", "sparkline": [100+x for x in range(30)]}
    except:
         all_data["MOVE"] = {"price": 105.2, "change_percent": 1.2, "trend": "MOCK", "sparkline": [100+x for x in range(30)]}

    # MARKET BREADTH (RSP vs SPY Relative Strength)
    try:
        if "RSP" in all_data and "SPY" in all_data:
            rsp_change = all_data["RSP"]["change_percent"]
            spy_change = all_data["SPY"]["change_percent"]
            breadth_diff = rsp_change - spy_change
            
            # Logic: If RSP outperforms SPY, breadth is healthy.
            # If SPY massively outperforms RSP (negative diff), breadth is narrow (Tech concentration).
            
            trend = "HEALTHY"
            if breadth_diff < -1.0: trend = "NARROW" # SPY leads RSP by > 1%
            elif breadth_diff > 0.5: trend = "BROAD" # RSP leads
            
            # Calculate Breadth History for Sparkline
            try:
                rsp_h = batch_hist["RSP"] if batch_hist is not None else yf.Ticker("RSP").history(period="1mo")
                spy_h = batch_hist["SPY"] if batch_hist is not None else yf.Ticker("SPY").history(period="1mo")
                
                # Take Close prices and normalize
                rsp_c = rsp_h['Close'].tail(22)
                spy_c = spy_h['Close'].tail(22)
                
                # Percentage change relative to start of period to normalize
                rsp_norm = (rsp_c / rsp_c.iloc[0]) * 100
                spy_norm = (spy_c / spy_c.iloc[0]) * 100
                breadth_spark = (rsp_norm - spy_norm).tolist()
            except:
                breadth_spark = [0]*30

            all_data["BREADTH"] = {
                "price": round(breadth_diff, 2), # The spread value
                "change_percent": 0.0,
                "trend": trend,
                "sparkline": [round(x, 2) for x in breadth_spark]
            }
        else:
            all_data["BREADTH"] = {"price": 0.5, "change_percent": 0.0, "trend": "HEALTHY", "sparkline": [0]*30}
    except:
        all_data["BREADTH"] = {"price": 0.5, "change_percent": 0.0, "trend": "HEALTHY", "sparkline": [0]*30}

    # SPY vs RSP Momentum (Redundant with breadth, but kept for specific widget if needed)
    if "SPY" in all_data and "RSP" in all_data:
        spy_mom = all_data["SPY"]["change_percent"]
        rsp_mom = all_data["RSP"]["change_percent"]
        all_data["SPY_MOMENTUM"] = {
             "price": round(spy_mom - rsp_mom, 2), "change_percent": 0, "trend": "SKEWED" if abs(spy_mom-rsp_mom) > 1 else "BALANCED", 
             "sparkline": [0]*30
        }
        
    # Copper/Gold
    if "COPPER" in all_data and "GOLD" in all_data and all_data["GOLD"]["price"] > 0:
        ratio = all_data["COPPER"]["price"] / all_data["GOLD"]["price"]
        all_data["COPPER_GOLD"] = {
             "price": round(ratio * 1000, 2), # Scale for visibility
             "change_percent": 0, "trend": "RISK-ON" if ratio > 0.002 else "RISK-OFF",
             "sparkline": [round(ratio*1000, 2)]*30
        }

    return all_data, status, real_events

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
    final = (legacy_score * 0.3) + \
            (sector_scores.get("STOCKS", 50) * 0.25) + \
            (sector_scores.get("CRYPTO", 50) * 0.1) + \
            (sector_scores.get("FOREX", 50) * 0.1) + \
            (sector_scores.get("COMMODITIES", 50) * 0.1)
            
    # NET LIQUIDITY ADJUSTMENT (The "GMSv2" Factor)
    # If Net Liquidity > 6.5T -> Add Risk
    # If Net Liquidity < 6.0T -> Reduce Risk
    net_liq = data.get("NET_LIQUIDITY", {}).get("price", 6200)
    if net_liq > 6400: final += 5
    elif net_liq < 6000: final -= 10
            
    return int(max(0, min(100, final)))

def fetch_breaking_news():
    """Fetches top headline from CNBC for AI context."""
    try:
        FEED_URL = 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114'
        res = requests.get(FEED_URL, timeout=10)
        if res.status_code == 200:
            root = ET.fromstring(res.text)
            item = root.find('.//item')
            if item is not None:
                title = item.find('title').text
                return title.strip()
    except Exception as e:
        print(f"[NEWS] Fetch failed: {e}")
    return "Market data synchronization active."

def generate_multilingual_report(data, score):
    """Generates AI analysis in 7 languages using Gemini."""
    required = ["EN", "JP", "CN", "ES", "HI", "ID", "AR"]
    
    # Professional Fallback Status (Used only when all AI methods fail AND no cached report exists)
    FALLBACK_STATUS = {
        "EN": "【GMS: {score}】Institutional macro intelligence updated. Market regimes are currently pricing in key economic shifts with a focus on liquidity and volatility metrics.",
        "JP": "【GMS: {score}】機関投資家向けマクロ指標が更新されました。市場は現在、流動性とボラティリティの指標を注視しながら、主要な経済環境の変化を織り込んでいます。",
        "CN": "【GMS: {score}】机构宏观情报已更新。市场目前正在消化关键经济转变，重点关注流动性和波动性指标。",
        "ES": "【GMS: {score}】Inteligencia macro institucional actualizada. Los regímenes de mercado están descontando actualmente cambios económicos clave.",
        "HI": "【GMS: {score}】संस्थागत मैक्रो इंटेलिजेंस अपडेट किया गया। बाजार वर्तमान में प्रमुख आर्थिक बदलावों को देखते हुए तरलता और अस्थिरता मेट्रिक्स पर ध्यान केंद्रित कर रहा है。",
        "ID": "【GMS: {score}】Intelijen makro institusional diperbarui. Rezim pasar saat ini memperhitungkan pergeseran ekonomi utama.",
        "AR": "【GMS: {score}】تم تحديث الاستخبارات الكلية المؤسسية. تقوم أنظمة السوق حاليًا بتسعير التحولات الاقتصادية الرئيسية."
    }
    
    # Format fallback with current score
    formatted_fallback = {lang: val.format(score=score) for lang, val in FALLBACK_STATUS.items()}

    if not GEMINI_KEY:
        return formatted_fallback

    context = {
        "score": score,
        "vix": data.get("VIX", {}).get("price"),
        "hy_spread": data.get("HY_SPREAD", {}).get("price"),
        "tnx": data.get("TNX", {}).get("price"),
        "dxy": data.get("DXY", {}).get("price"),
        "spy_trend": data.get("SPY", {}).get("trend")
    }
    
    net_liq_val = data.get("NET_LIQUIDITY", {}).get("price", "N/A")
    move_val = data.get("MOVE", {}).get("price", "N/A")
    
    # 0. RESOURCE SAVING: Check for recent valid report to reuse
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                current = json.load(f)
                last_upd_str = current.get("last_updated", "")
                if last_upd_str:
                    # Robust Parsing: Handle ISO 8601 or legacy "EST" format
                    try:
                        if "T" in last_upd_str:
                            last_upd_dt = datetime.strptime(last_upd_str.replace("Z", ""), "%Y-%m-%dT%H:%M:%S")
                        else:
                            last_upd_dt = datetime.strptime(last_upd_str.replace(" EST", ""), "%Y-%m-%d %H:%M:%S")
                        
                        if (datetime.utcnow() - last_upd_dt).total_seconds() < 600: # 10 Minutes (Comparing UTC)
                            existing_reports = current.get("analysis", {}).get("reports")
                            if existing_reports and all(lang in existing_reports for lang in required):
                                # CRITICAL: Do not skip if reports contain placeholders
                                is_placeholder = False
                                for lang, content in existing_reports.items():
                                    if any(p in content for p in ["世界市場は主要な経済指標", "Deep-diving into", "深度解析"]):
                                        is_placeholder = True
                                        break
                                
                                if not is_placeholder:
                                    print(f"[AI SKIP] Recent VALID report exists (<10m). Reusing.")
                                    return existing_reports
                                else:
                                    print(f"[AI REFRESH] Existing report is a placeholder. Forcing fresh generation.")
                    except Exception as date_err:
                        print(f"[AI SKIP DEBUG] Date parse skip: {date_err}")
    except Exception as e:
        print(f"[AI SKIP ERROR] Failed to check cache: {e}")

    breaking_news = fetch_breaking_news()

    prompt = f"""
【AIインサイトのシステム・プロンプト v3.2：スコア・センチメント完全同期モード】

# Role
You are a Senior Global Macro Strategist (ex-Goldman Sachs/BlackRock). 
Provide high-density, professional market intelligence for institutional investors.

# Inputs
- Current GMS Score: {score}/100
- US Net Liquidity: ${net_liq_val}B
- Bond Volatility (MOVE): {move_val}
- Equity Volatility (VIX): {context['vix']}
- HY Credit Spread: {context['hy_spread']}%
- Breaking News Context: {breaking_news}

# Strategy Constraints (CRITICAL)
1. **Regime Alignment**: 
   - If GMS <= 50: Use "Defensive" or "Cautionary" tone. **PROHIBIT** terms like "Risk-on" or "Bullish expansion".
   - If GMS > 60: Focus on "Risk-on" and "Accumulation".
2. **Causal Logic**: Do not just list data. Explain the "Why" (e.g., "Elevated MOVE index is directly tightening financial conditions, forcing a defensive pivot in Nasdaq...").
3. **Sector Impact Density**: Explicitly mention specific assets/sectors (e.g., QQQ/Tech, BTC/Crypto, HY Bonds, Gold) that are most impacted by this score.
4. **Physical Limit**:
   - Japanese: Around 300 characters. Provide "depth" and "weight" in your sentences.
   - English: Around 120 words.
5. **Strict JSON Format** (Keys: EN, JP, CN, ES, HI, ID, AR):
   {{
     "LANG_CODE": {{
       "GMS": "【GMS: {score}】[One-sentence professional conclusion]",
       "Analysis": "[Detailed causal macro analysis including sector impacts]",
       "News": "【速報影響】[Brief news impact analysis]"
     }}
   }}
"""

    # Node.js Bridge Implementation with 429 Resilience
    # This ensures strict adherence to Vercel AI SDK authentication specs
    for attempt in range(2): # 2 Retries for Node Bridge
        try:
            print(f"[AI BRIDGE] Calling Node.js bridge for Gemini 2.0 Flash (Attempt {attempt+1})...")
            
            # Prepare input payload for Node.js script
            input_payload = json.dumps({"prompt": prompt})
            
            # Path to the TS source bridge script (relative to frontend dir)
            script_path = "scripts/generate_insight.ts"
            
            # Frontend Directory
            frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

            # Execute Node.js bridge from FRONTEND directory
            # Explicitly pass environment (inheriting API keys)
            process = subprocess.run(
                ["npx", "tsx", script_path, prompt],
                capture_output=True,
                text=True,
                encoding='utf-8', # Force UTF-8 for Windows resilience
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0,
                check=False,
                env=os.environ.copy(),
                cwd=frontend_dir 
            )

            if process.returncode == 0:
                # Parse output from Node.js
                stdout_content = process.stdout # Already decoded via encoding='utf-8'
                # print(f"[AI BRIDGE DEBUG] Raw stdout: {stdout_content[:300]}...") # REMOVED: Caused encoding error on Windows term
                
                # Robust Extraction: Use Regex to find the JSON block
                text = ""
                # Search for {"text":"..."} anywhere in the output
                match = re.search(r'\{"text":\s*".*?"\}', stdout_content, re.DOTALL)
                if match:
                    try:
                        json_obj = json.loads(match.group(0))
                        text = json_obj.get("text", "").strip()
                    except: pass
                
                # Fallback: Split lines and check prefix (for cleaner logs)
                if not text:
                    for line in stdout_content.splitlines():
                        if '{"text":' in line:
                            try:
                                # Try to find where the JSON starts
                                start_idx = line.find('{"text":')
                                json_part = line[start_idx:]
                                json_obj = json.loads(json_part)
                                text = json_obj.get("text", "").strip()
                                break
                            except: continue

                if not text:
                    print(f"[AI BRIDGE ERROR] Could not extract 'text' from bridge output via Regex or Line Split.")
                    break

                print(f"[AI SUCCESS] Extracted text via Node.js Bridge.")
                
                # Robust JSON Parsing (Cleanup Markdown)
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                
                reports = json.loads(text)
                
                # Consolidate v3.2 multi-field structure if present
                for lang in reports:
                    val = reports[lang]
                    if isinstance(val, dict):
                        parts = []
                        if 'GMS' in val: parts.append(val['GMS'])
                        elif 'score' in val: parts.append(f"【GMS: {val['score']}】")
                        
                        if 'Analysis' in val: parts.append(f"【分析】{val['Analysis']}")
                        elif 'analysis' in val: parts.append(f"【分析】{val['analysis']}")
                        
                        if 'News' in val: parts.append(f"【速報影響】{val['News']}")
                        elif 'News impact' in val: parts.append(f"【速報影響】{val['News impact']}")
                        elif 'Breaking News Impact' in val: parts.append(f"【速報影響】{val['Breaking News Impact']}")
                        elif 'impact' in val: parts.append(f"【速報影響】{val['impact']}")
                        
                        reports[lang] = " ".join(parts)
                
                # Validate keys
                for lang in required:
                    if lang not in reports:
                        reports[lang] = FALLBACK_STATUS.get(lang, FALLBACK_STATUS["EN"])
                
                return reports
            else:
                stderr_content = process.stderr
                print(f"[AI BRIDGE ERROR] Node.js process failed: {stderr_content}")
                
                if "429" in stderr_content:
                    print(f"[AI RATE LIMIT] 429 detected in Node Bridge. Waiting 30s...")
                    time.sleep(30)
                    continue
                else:
                    break # Critical other error: skip to fallback
                
        except Exception as e:
            print(f"[AI BRIDGE CRITICAL] Bridge execution failed: {e}")
            break # Skip to fallback

    # Fallback to Direct REST API (Bypassing local SDK issues)
    # Using gemini-1.5-flash as the most stable REST target with Retry
    for attempt in range(2): 
        try:
            print(f"[AI FALLBACK] Attempting Direct REST API (gemini-1.5-flash) - Attempt {attempt+1}...")
            headers = {"Content-Type": "application/json"}
            # API Endpoint for Gemini 1.5 Flash
            url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 1000
                }
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                # Extract text from Candidate 0
                if 'candidates' in result and result['candidates']:
                    text = result['candidates'][0]['content']['parts'][0]['text']
                    print(f"[AI SUCCESS] Generated via REST API.")
                    
                    # Clean Markdown if present
                    text = text.replace("```json", "").replace("```", "").strip()
                    
                    reports = json.loads(text)
                    
                    # Consolidate v3.2 multi-field structure
                    for lang in reports:
                        val = reports[lang]
                        if isinstance(val, dict):
                            parts = []
                            if 'GMS' in val: parts.append(val['GMS'])
                            elif 'score' in val: parts.append(f"【GMS: {val['score']}】")
                            if 'Analysis' in val: parts.append(f"【分析】{val['Analysis']}")
                            elif 'analysis' in val: parts.append(f"【分析】{val['analysis']}")
                            if 'News' in val: parts.append(f"【速報影響】{val['News']}")
                            elif 'impact' in val: parts.append(f"【速報影響】{val['impact']}")
                            reports[lang] = " ".join(parts)

                    # Validate keys
                    for lang in required:
                        if lang not in reports:
                            reports[lang] = FALLBACK_STATUS.get(lang, FALLBACK_STATUS["EN"])
                    return reports
                else:
                     print(f"[AI REST ERROR] No candidates returned: {result}")
                     break
            elif response.status_code == 429:
                print(f"[AI REST RATE LIMIT] 429 detected. Waiting 30s...")
                time.sleep(30)
                continue
            else:
                print(f"[AI REST ERROR] Status {response.status_code}: {response.text}")
                break

        except Exception as e:
            print(f"[AI REST CRITICAL] Request failed: {e}")
            break

    # Deep Fallback to Gemini 1.0 Pro (If 1.5 fails)
    try:
        print(f"[AI DEEP FALLBACK] Attempting Direct REST API (gemini-1.0-pro)...")
        headers = {"Content-Type": "application/json"}
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key={GEMINI_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt + " Output JSON only."}]}]
        }
        response = requests.post(url, headers=headers, json=payload, timeout=20)
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and result['candidates']:
                text = result['candidates'][0]['content']['parts'][0]['text']
                # Try to parse JSON from pro output
                if "```json" in text: text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text: text = text.split("```")[1].split("```")[0].strip()
                reports = json.loads(text)
                print(f"[AI SUCCESS] Generated via 1.0 Pro.")
                return reports
    except Exception as e:
        print(f"[AI DEEP CRITICAL] 1.0 Pro failed: {e}")

    # Ultimate Fallback: Try to reuse ANY existing valid report from cache before using static text
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                current = json.load(f)
                existing_reports = current.get("analysis", {}).get("reports")
                if existing_reports and all(lang in existing_reports for lang in required):
                    # Check if it's a placeholder
                    is_placeholder = False
                    for l, content in existing_reports.items():
                         if any(p in content for p in ["世界市場は主要な経済指標", "Institutional macro intelligence updated"]):
                             is_placeholder = True
                             break
                    if not is_placeholder:
                        print("[AI FAILURE] All methods failed. Reusing last VALID cached report to ensure user experience.")
                        return existing_reports
    except: pass

    print("[AI FAILURE] All methods failed and no valid cache exists. Using Static Fallback.")
    return formatted_fallback

def get_next_event_dates():
    # Fallback static if API fails
    return [
        {"code": "cpi", "name": "CPI INFLATION DATA", "date": "2026-01-14", "day": "WED", "time": "08:30 EST", "impact": "high"},
        {"code": "fomc", "name": "FOMC RATE DECISION", "date": "2026-01-28", "day": "WED", "time": "14:00 EST", "impact": "critical"},
        {"code": "nfp", "name": "NON-FARM PAYROLLS", "date": "2026-02-06", "day": "FRI", "time": "08:30 EST", "impact": "high"}
    ]

def update_signal():
    print("Running OmniMetric v2.0 Engine...")
    
    # 1. Execution Control: 10-Minute Cool-down
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                last_upd_str = existing_data.get("last_successful_update")
                if last_upd_str:
                    # Handle both space and T formats for safety
                    last_upd_str = last_upd_str.replace(' ', 'T').replace('Z', '')
                    last_upd_dt = datetime.fromisoformat(last_upd_str)
                    if (datetime.utcnow() - last_upd_dt).total_seconds() < 600:
                        print(f"[AIO] SKIPPING UPDATE: Recently updated ({last_upd_str}). Cool-down active.")
                        return existing_data
    except Exception as e:
        print(f"[AIO] Cool-down check failed: {e}")

    validate_api_keys()
    market_data, status, fetched_events = fetch_market_data()
    
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
        events = fetched_events if fetched_events and len(fetched_events) > 0 else get_next_event_dates()

        # History Management
        history = []
        try:
            if os.path.exists(HISTORY_FILE):
                with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                    history = json.load(f)
        except: pass
        
        # Append new entry (UTC)
        new_entry = {
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), # ISO UTC
            "score": score
        }
        history.append(new_entry)
        
        # Prune (Keep last 60 entries - approx 2.5 days of hourly updates)
        if len(history) > 60:
            history = history[-60:]
            
        # Save History
        try:
            with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
                json.dump(history, f, indent=4)
        except: pass

        # Format for Frontend Chart
        # Expected format: [{"date": "HH:MM", "score": 75}, ...]
        history_chart = []
        for h in history:
            try:
                # Parse ISO timestamp (handle both with and without Z)
                ts = h["timestamp"].replace('Z', '')
                dt = datetime.fromisoformat(ts)
                fmt_date = dt.strftime("%m/%d %H:%M")
                history_chart.append({"date": fmt_date, "score": h["score"]})
            except: continue

        payload = {
            "last_updated": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), # ISO UTC
            "last_successful_update": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), # ISO UTC
            "gms_score": score,
            "sector_scores": sector_scores, 
            "market_data": market_data,
            "events": events,
            "analysis": {
                "title": "Global Market Outlook",
                "content": ai_reports['EN'],
                "reports": ai_reports
            },
            "history_chart": history_chart, # NEW: Added history chart data
            "system_status": status
        }

        
        # SANITIZE PAYLOAD - Remove NaNs
        def sanitize(obj):
            if obj is None: return 0.0
            if isinstance(obj, float):
                if np.isnan(obj) or np.isinf(obj): return 0.0
                return obj
            if isinstance(obj, dict):
                return {k: sanitize(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [sanitize(x) for x in obj]
            return obj

        payload = sanitize(payload)
        
        # Archive using UTC date
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        archive_path = os.path.join(ARCHIVE_DIR, f"{today_str}.json")
        try:
            with open(archive_path, 'w', encoding='utf-8') as f:
                json.dump(payload, f, indent=4, ensure_ascii=False)
        except: pass

        try:
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(payload, f, indent=4, ensure_ascii=False)
        except Exception as e:
            print(f"Error writing to DATA_FILE: {e}")

        try:
            # TRIGGER FAST INDEXING IF SCORE CRASHES (Score < 40 and was >= 40)
            # Find previous score
            prev_score = 50
            if len(history) >= 2:
                 prev_score = history[-2]["score"]
            
            if score < 40 and prev_score >= 40:
                print(f"[AIO] CRITICAL EVENT: Score dropped to {score}. Triggering Fast Indexing...")
                 # IndexNow Notification (GEO Optimization)
                try:
                    indexing_host = os.getenv("INDEXNOW_HOST", "omnimetric.net")
                    indexing_key = os.getenv("INDEXNOW_KEY")
                    if not indexing_key:
                        print("[AIO] Skipping IndexNow: Missing Key")
                        return payload

                    print(f"Notifying IndexNow via Bing for {indexing_host}...")
                    indexnow_url = "https://api.indexnow.org/indexnow"
                    headers = {"Content-Type": "application/json; charset=utf-8"}
                    data = {
                        "host": indexing_host,
                        "key": indexing_key,
                        "keyLocation": f"https://{indexing_host}/{indexing_key}.txt",
                        "urlList": [
                            f"https://{indexing_host}/",
                            f"https://{indexing_host}/stocks",
                            f"https://{indexing_host}/crypto",
                            f"https://{indexing_host}/forex",
                            f"https://{indexing_host}/commodities"
                        ]
                    }
                    response = requests.post(indexnow_url, headers=headers, json=data, timeout=5)
                    print(f"IndexNow Status: {response.status_code}")
                except Exception as e:
                    print(f"IndexNow Error: {e}")
            else:
                 print(f"[AIO] Score Normal ({score}). Skipping Fast Indexing.")

        except Exception as e:
            print(f"[AIO] Indexing Trigger Error: {e}")

        return payload

    else:
        return {
            "last_updated": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
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
    except Exception as e:
        print(f"MAIN ERROR: {e}")
        import traceback
        traceback.print_exc()
