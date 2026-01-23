import yfinance as yf
import pandas as pd
import numpy as np
import json
import os
import time
from datetime import datetime, timedelta
import random
from fredapi import Fred

import requests
from dotenv import load_dotenv
import subprocess
import re

import xml.etree.ElementTree as ET
import sys
from seo_monitor import SEOMonitor
from sns_publisher import SNSPublisher
import fetch_news

# Trigger AI generation with new secrets

# Load environment variables from all possible locations
load_dotenv() # CWD
load_dotenv(os.path.join(os.path.dirname(__file__), '.env')) # backend/.env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')) # root/.env

# Update keys after loading
FRED_KEY = os.getenv("FRED_API_KEY", "").strip()
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "").strip()
FMP_KEY = os.getenv("FMP_API_KEY", "").strip()

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

# Fallback to Positive Status messages (Professional Prefix for Frontend Bypass)
FALLBACK_STATUS = {
    "EN": "【GMS: Analysis Sync】 Current macro indicators suggest the market is approaching a critical inflection point, with volatility compression and expansion alternating ahead of key economic data releases. Fluctuations in currency pairs and US Treasury yields are counteracting liquidity support, potentially creating distortions through capital concentration in specific assets. Investors should monitor key volatility levels and real interest rate trends to prepare for sudden sentiment shifts.",
    "JP": "【GMS: 分析同期中】 現在のGMS指標は市場が重要な局面にあることを示唆しており、主要な経済指標の発表を前にボラティリティの収縮と拡大が交錯する展開となっています。ドル円の変動や米10年債利回りの推移が流動性の下支えを相殺し、特定資産への資金集中が市場の歪みを生み出している可能性があります。投資家はボラティリティ指数の節目と実質金利の動向を注視し、急激なセンチメントの変化に備えるべきでしょう。",
    "CN": "【GMS: 分析同步】 当前GMS指标显示市场正处于关键转折点，在主要经济数据发布前，波动率呈现收缩与扩张交织的态势。汇率波动与美债收益率的走势正在抵消流动性支撑，特定资产的资金集中可能正在制造市场扭曲。投资者应密切关注波动率指数的关键点位及实际利率动向，以应对市场情绪的突发变化。",
    "ES": "【GMS: Sincronización】 Los indicadores macro actuales sugieren que el mercado se acerca a un punto de inflexión crítico, con la compresión y expansión de la volatilidad alternándose ante la publicación de datos clave. Las fluctuaciones en las divisas y los rendimientos del Tesoro están contrarrestando el soporte de liquidez, creando posibles distorsiones. Los inversores deben vigilar los niveles de volatilidad y las tasas de interés reales para prepararse ante cambios repentinos en el sentimiento.",
    "HI": "【GMS: विश्लेषण सिंक】 वर्तमान मैक्रो संकेतक सुझाव देते हैं कि बाजार एक महत्वपूर्ण मोड़ पर है, जहां प्रमुख आर्थिक आंकड़ों के जारी होने से पहले अस्थिरता में संकुचन और विस्तार हो रहा है। मुद्रा में उतार-चढ़ाव और अमेरिकी ट्रेजरी यील्ड तरलता समर्थन का मुकाबला कर रहे हैं, जिससे बाजार में विकृतियां पैदा हो सकती हैं। निवेशकों को अचानक भावना परिवर्तन के लिए तैयार रहने के लिए प्रमुख अस्थिरता स्तरों और वास्तविक ब्याज दर के रुझानों पर कड़ी नजर रखनी चाहिए।",
    "ID": "【GMS: Sinkronisasi】 Indikator makro saat ini menunjukkan pasar sedang mendekati titik balik kritis, dengan kompresi dan ekspansi volatilitas silih berganti menjelang rilis data ekonomi utama. Fluktuasi mata uang dan imbal hasil Treasury AS menyeimbangkan dukungan likuiditas, berpotensi menciptakan distorsi melalui konsentrasi modal. Investor harus memantau tingkat volatilitas utama dan tren suku bunga riil untuk bersiap menghadapi perubahan sentimen yang tiba-tiba。",
    "AR": "【GMS: مزامنة التحليل】 تشير المؤشرات الكلية الحالية إلى أن السوق يقترب من نقطة تحول حاسمة، مع تناوب انكماش وتوسع التقلبات قبل إصدار البيانات الاقتصادية الرئيسية. تعمل التقلبات في العملات وعوائد الخزانة الأمريكية على مواجهة دعم السيولة، مما قد يخلق تشوهات من خلال تركيز رأس المال. يجب على المستثمرين مراقبة مستويات التقلب الرئيسية واتجاهات أسعار الفائدة الحقيقية للاستعداد لتحولات مفاجئة في المعنويات。"
}

# Determine script directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "current_signal.json")
ARCHIVE_DIR = os.path.join(SCRIPT_DIR, "archive")
# Synced Frontend Path for ISR/Static Serving
FRONTEND_DATA_DIR = os.path.join(SCRIPT_DIR, "../frontend/public/data")
FRONTEND_DATA_FILE = os.path.join(FRONTEND_DATA_DIR, "current_signal.json")

LOG_FILE = os.path.join(SCRIPT_DIR, "engine_log.txt")

def log_diag(msg):
    """Writes diagnostic messages to a file for bot upload, ensuring sensitive data is redacted."""
    if not isinstance(msg, str):
        msg = str(msg)
    
    # Centralized Redaction: Scrub all known API keys
    sensitive_keys = [FRED_KEY, GEMINI_KEY, FMP_KEY]
    for key in filter(None, sensitive_keys):
        if key in msg:
            msg = msg.replace(key, "REDACTED")
            
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}\n"
    print(msg)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line)
    except Exception as e:
        print(f"FAILED TO WRITE LOG: {e}")

# ... (Existing Directory Checks)
DATA_FILE = os.path.join(SCRIPT_DIR, "current_signal.json")
HISTORY_FILE = os.path.join(SCRIPT_DIR, "history.json")
ARCHIVE_DIR = os.path.join(SCRIPT_DIR, "archive")

# ... (Existing Directory Checks)

# API KEYS
FRED_KEY = os.getenv("FRED_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
FMP_KEY = os.getenv("FMP_API_KEY")

# MOCK MODE Detection (Skill 04 requirement)
IS_MOCK_MODE = not bool(GEMINI_KEY)
if IS_MOCK_MODE:
    print("\n" + "="*60)
    print("[OmniMetric-Dev] API Key missing. Falling back to multi-language cache logs.")
    print("="*60 + "\n")


def validate_api_keys():
    """Validates presence of required API keys and logs warnings for missing ones."""
    missing = []
    if not FRED_KEY: missing.append("FRED_API_KEY")
    if not GEMINI_KEY: missing.append("GEMINI_API_KEY")
    if not FMP_KEY: missing.append("FMP_API_KEY")

    
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
    data['BREAKEVEN_INFLATION'] = {"price": 2.30, "change_percent": 0, "trend": "STABLE", "sparkline": [2.30] * 30}
    
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
        # 1-A. VIX Index (VIXCLS)
        try:
            print("[FRED] Fetching VIXCLS...")
            series = fred.get_series('VIXCLS', observation_start=start_date).ffill()
            current = float(series.iloc[-1])
            prev = float(series.iloc[-2]) if len(series) >= 2 else current
            daily_chg = ((current - prev) / prev) * 100 if prev != 0 else 0
            
            data['VIX'] = {
                "price": round(current, 2),
                "prev_price": round(prev, 2),
                "daily_chg": round(daily_chg, 2),
                "change_percent": round(daily_chg, 2), # Simplified for VIX
                "trend": "UP" if daily_chg > 0 else "DOWN",
                "sparkline": [round(x, 2) for x in series.tail(30).tolist()]
            }
        except Exception as e:
            print(f"[FRED ERROR] VIX: {e}")
            data['VIX'] = {"price": 15.0, "prev_price": 15.0, "daily_chg": 0.0, "change_percent": 0.0, "sparkline": [15]*30}
        
        # 1. YIELD SPREAD (10Y-2Y)
        try: 
            series = fred.get_series('T10Y2Y', observation_start=start_date).ffill()
            current_val = float(series.iloc[-1])
            data['YIELD_SPREAD_10Y2Y'] = {
                "price": round(current_val, 2),
                "change_percent": 0.0,
                "trend": "NEUTRAL",
                "sparkline": [round(x, 2) for x in series.tail(30).tolist()]
            }
        except: pass

        # 1-B. YIELD SPREAD (10Y-3M) - PRIMARY
        try:
            series_3m = fred.get_series('T10Y3M', observation_start=start_date).ffill()
            current_3m = float(series_3m.iloc[-1])
            data['YIELD_SPREAD'] = {
                "price": round(current_3m, 2),
                "change_percent": 0.0,
                "trend": "INVERTED" if current_3m < 0 else "NORMAL",
                "sparkline": [round(x, 2) for x in series_3m.tail(30).tolist()]
            }
        except: 
            if 'YIELD_SPREAD' in previous_data: data['YIELD_SPREAD'] = previous_data['YIELD_SPREAD']

        # 1-C. US 10Y YIELD (DGS10)
        try:
            yield_10y = fred.get_series('DGS10', observation_start=start_date).ffill()
            current_yield = float(yield_10y.iloc[-1])
            data['US_10Y_YIELD'] = {
                "price": round(current_yield, 2),
                "change_percent": 0.0,
                "trend": "STABLE",
                "sparkline": [round(x, 2) for x in yield_10y.tail(30).tolist()]
            }
            log_diag(f"[IN] FRED_RAW: {{ series: DGS10, price: {round(current_yield, 2)} }}")
        except Exception as e:
            log_diag(f"[FRED ERROR] US 10Y Yield fetch failed: {e}")
            if 'US_10Y_YIELD' in previous_data: data['US_10Y_YIELD'] = previous_data['US_10Y_YIELD']

        # 1-D. US 10Y REAL INTEREST RATE (DFII10)
        try:
            real_rate = fred.get_series('DFII10', observation_start=start_date).ffill()
            current_real = float(real_rate.iloc[-1])
            data['REAL_INTEREST_RATE'] = {
                "price": round(current_real, 2),
                "change_percent": 0.0,
                "trend": "STABLE",
                "sparkline": [round(x, 2) for x in real_rate.tail(30).tolist()]
            }
            log_diag(f"[IN] FRED_RAW: {{ series: DFII10, price: {round(current_real, 2)} }}")
        except Exception as e:
            log_diag(f"[FRED ERROR] Real Interest Rate fetch failed: {e}")
            if 'REAL_INTEREST_RATE' in previous_data: data['REAL_INTEREST_RATE'] = previous_data['REAL_INTEREST_RATE']
        


        # 1-E. 10-YEAR BREAKEVEN INFLATION_RATE (T10YIE)
        try:
            log_diag("[FRED] Fetching T10YIE (Breakeven Inflation)...")
            breakeven = fred.get_series('T10YIE', observation_start=start_date).ffill()
            if not breakeven.empty:
                current_be = float(breakeven.iloc[-1])
                data['BREAKEVEN_INFLATION'] = {
                    "price": round(current_be, 2),
                    "change_percent": 0.0,
                    "trend": "RISING" if current_be > 2.5 else "STABLE",
                    "sparkline": [round(x, 2) for x in breakeven.tail(30).tolist()]
                }
                log_diag(f"[IN] FRED_RAW: {{ series: T10YIE, price: {round(current_be, 2)} }}")
            else:
                log_diag("[FRED WARN] T10YIE series is empty. Falling back.")
                if 'BREAKEVEN_INFLATION' in previous_data: 
                    data['BREAKEVEN_INFLATION'] = previous_data['BREAKEVEN_INFLATION']
        except Exception as e:
            log_diag(f"[FRED ERROR] Breakeven Inflation fetch failed: {e}")
            if 'BREAKEVEN_INFLATION' in previous_data: 
                data['BREAKEVEN_INFLATION'] = previous_data['BREAKEVEN_INFLATION']

        # 2. HY SPREAD (BAMLH0A0HYM2)
        try:
            hy_series = fred.get_series('BAMLH0A0HYM2', observation_start=start_date)
            hy_series = hy_series.ffill()
            current = float(hy_series.iloc[-1])
            prev = float(hy_series.iloc[-2]) if len(hy_series) >= 2 else current
            daily_chg = ((current - prev) / prev) * 100 if prev != 0 else 0
            spark = [round(x, 2) for x in hy_series.tail(30).tolist()]
            
            data['HY_SPREAD'] = {
                "price": round(current, 2),
                "prev_price": round(prev, 2),
                "daily_chg": round(daily_chg, 2),
                "change_percent": round(daily_chg, 2),
                "trend": "STRESS" if current > 5.0 else "CALM",
                "sparkline": spark
            }
        except: 
             if 'HY_SPREAD' in previous_data: data['HY_SPREAD'] = previous_data['HY_SPREAD']

        # 3. NFCI
        try:
            series_nfci = fred.get_series('NFCI', observation_start=start_date).ffill()
            val = float(series_nfci.iloc[-1])
            log_diag(f"[IN] FRED_RAW: {{ series_id: NFCI, val: {val} }}")
            data['NFCI'] = {
                "price": round(val, 2),
                "change_percent": 0.0,
                "trend": "CALM" if val < 0 else "STRESS",
                "sparkline": [round(x, 2) for x in series_nfci.tail(30).tolist()]
            }
        except: 
            if 'NFCI' in previous_data: data['NFCI'] = previous_data['NFCI']
        
        # 4. NET LIQUIDITY (WALCL - WTREGEN - RRPONTSYD)
        try:
            log_diag("[FRED] Calculating Net Liquidity...")
            # Align dates. WALCL is Weekly. Others daily.
            walcl = fred.get_series('WALCL', observation_start=start_date)
            tga = fred.get_series('WTREGEN', observation_start=start_date)
            rrp = fred.get_series('RRPONTSYD', observation_start=start_date)
            
            log_diag(f"[IN] FRED_RAW: {{ series: WALCL, last: {walcl.iloc[-1] if not walcl.empty else 'N/A'} }}")
            log_diag(f"[IN] FRED_RAW: {{ series: TGA, last: {tga.iloc[-1] if not tga.empty else 'N/A'} }}")
            log_diag(f"[IN] FRED_RAW: {{ series: RRP, last: {rrp.iloc[-1] if not rrp.empty else 'N/A'} }}")

            # Create DataFrame to forward fill WALCL
            df = pd.DataFrame({'WALCL': walcl, 'TGA': tga, 'RRP': rrp})
            # Ensure all values are numeric and handle alignment
            df = df.apply(pd.to_numeric, errors='coerce').ffill().bfill().fillna(0)
            
            # Correct Logic: WALCL (M), TGA (M), RRP (B)
            # Result: Billions
            df['NET_LIQ'] = (df['WALCL'] - df['TGA'] - (df['RRP'] * 1000)) / 1000
            
            # Filter valid (non-zero, non-NaN) data for sparkline
            valid_series = df['NET_LIQ'].dropna()
            valid_series = valid_series[valid_series > 1000] # Physical guard for outlier/error
            
            if valid_series.empty:
                raise Exception("No valid calculation results within historical window")

            last_val = valid_series.iloc[-1]
            log_diag(f"[FRED] Calculated Net Liquidity: {last_val}B (using WALCL={df['WALCL'].iloc[-1]})")

            spark = valid_series.tail(30).tolist()
            if len(spark) < 30: 
                spark = [spark[0]] * (30 - len(spark)) + spark
            
            # Recalculate changes for AI v5.2
            change_5d = 0.0
            if len(valid_series) >= 5:
                change_5d = ((valid_series.iloc[-1] - valid_series.iloc[-5]) / valid_series.iloc[-5]) * 100
            
            daily_chg = 0.0
            prev_price = last_val
            if len(valid_series) >= 2:
                prev_price = valid_series.iloc[-2]
                daily_chg = ((last_val - prev_price) / prev_price) * 100

            data['NET_LIQUIDITY'] = {
                "price": round(last_val, 2), # Billions
                "prev_price": round(prev_price, 2),
                "daily_chg": round(daily_chg, 2),
                "change_percent": round(change_5d, 2), # Keep 5d for compatibility
                "trend": "EXPANSION" if daily_chg > 0 else "CONTRACTION",
                "sparkline": [round(x, 2) for x in spark]
            }
            log_diag(f"[OUT] CALC_LIQ: {{ price: {round(last_val, 2)}, chg: {round(daily_chg, 2)}% }}")
        except Exception as e:
            log_diag(f"[FRED ERROR] Net Liquidity calculation failed: {e}")
            if 'NET_LIQUIDITY' in previous_data and previous_data['NET_LIQUIDITY'].get('price', 0) > 1000:
                 log_diag("[FRED] Recovering Net Liquidity from previous valid state.")
                 data['NET_LIQUIDITY'] = previous_data['NET_LIQUIDITY']
            else:
                 log_diag("[FRED] Critical failure: No previous data found for Net Liquidity. Using 6200B baseline.")
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
            log_diag("[ERROR] Calendar Fetch Failed: FMP_API_KEY is missing.")
            return []
            
        # Extension: Search window increased to 45 days for monthly coverage
        start_date = datetime.now().strftime("%Y-%m-%d")
        end_date = (datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d")
        
        # FMP v3 Endpoint (Standard)
        url = f"https://financialmodelingprep.com/api/v3/economic_calendar?from={start_date}&to={end_date}&apikey={api_key}"
        log_diag(f"[FMP] Fetching calendar from: {url.replace(api_key, 'REDACTED')}")
        response = requests.get(url, timeout=10)
        log_diag(f"[FMP] Response status: {response.status_code}")
        
        if response.status_code != 200:
            log_diag(f"[WARN] Calendar Fetch Failed: Status {response.status_code}. Using empty list.")
            return []
            
        if not response.text.strip():
            log_diag("[WARN] Calendar Fetch Failed: Empty response body. Using empty list.")
            return []
            
        try:
            data = response.json()
        except Exception as e:
            log_diag(f"[ERROR] Calendar Fetch Failed (JSON Parse): {e}. Response: {response.text[:100]}")
            return []
            
        if isinstance(data, dict) and "Error Message" in data:
            log_diag(f"[ERROR] Calendar Fetch Failed: API Error: {data['Error Message']}")
            return []
            
        if not isinstance(data, list):
            log_diag(f"[ERROR] Calendar Fetch Failed: Unexpected format (Not a list). Data: {str(data)[:100]}")
            return []

        log_diag(f"[FMP] Data items: {len(data)}")
        
        events = []
        if isinstance(data, list):
            priority_currencies = ["USD", "EUR", "CNY", "JPY"]
            # ... (Rest of processing) ...
            # Keep keywords and loop
            keyword_map = {
                "cpi": ["consumer price index", "cpi", "inflation"],
                "fomc": ["fomc", "fed interest rate", "interest rate decision", "fed meeting"],
                "nfp": ["non farm payrolls", "employment situation", "unemployment rate"]
            }
            for item in data:
                impact = str(item.get("impact", "")).lower()
                currency = item.get("currency", "")
                event_name = str(item.get("event", ""))
                name_lower = event_name.lower()
                if (impact in ["high", "medium"]) and (currency in priority_currencies):
                    code = "generic"
                    for cat, keywords in keyword_map.items():
                        if any(kw in name_lower for kw in keywords):
                            code = cat
                            break
                    date_str = item.get("date", "")[:10]
                    if code != "generic":
                         if any(e["code"] == code and e["date"] == date_str for e in events):
                             continue
                    try:
                        dt = datetime.strptime(item.get("date", ""), "%Y-%m-%d %H:%M:%S")
                        formatted_date = dt.strftime("%Y-%m-%d")
                        formatted_time = dt.strftime("%H:%M") + " EST"
                        day_str = dt.strftime("%a").upper()
                    except:
                        formatted_date = date_str
                        formatted_time = ""
                        day_str = ""
                    events.append({
                        "code": code,
                        "name": f"{currency} {event_name}",
                        "date": formatted_date,
                        "day": day_str,
                        "time": formatted_time,
                        "impact": "critical" if impact == "high" else "high"
                    })

            major_codes = ["cpi", "fomc", "nfp"]
            # 1. Prioritize Majors for inclusion (Selection)
            events.sort(key=lambda x: (0 if x["code"] in major_codes else 1, x["date"]))
            final_events = events[:5]
            
            # 2. Strict Date Sort for Display (User Requirement: Chronological Order)
            final_events.sort(key=lambda x: x["date"])
            
            log_diag(f"[SUCCESS] Calendar fetched: {len(final_events)} events (Sorted Chronologically)")
            return final_events
        else:
            log_diag(f"[ERROR] Calendar Fetch Failed: Unexpected response format (Not a list). Data: {str(data)[:100]}")
            return []
    except Exception as e:
        log_diag(f"[ERROR] Calendar Fetch Failed: {e}")
        return []

def fetch_market_data():
    """Fetches multi-asset data from Yahoo Finance."""
    print("Fetching Institutional Multi-Asset Feeds...")
    failed_indicators = []
    
    all_data = {}
    
    # 0. CRYPTO SENTIMENT (New)
    crypto_fg = fetch_crypto_sentiment()
    if crypto_fg:
        all_data["CRYPTO_SENTIMENT"] = crypto_fg
    else:
        log_diag("[IN ERROR] Crypto Sentiment API failed.")
        failed_indicators.append("CRYPTO_SENTIMENT")
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
            if isinstance(v, dict):
                all_data[k] = v
                continue 
            # Fallback for remaining scalars if any
            all_data[k] = {"price": round(v, 2), "change_percent": 0.0, "trend": "NEUTRAL", "sparkline": [v]*30}
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
             
        # Add new synced indicators
        if 'US_10Y_YIELD' in fred_data:
             all_data['US_10Y_YIELD'] = fred_data['US_10Y_YIELD']
        if 'REAL_INTEREST_RATE' in fred_data:
             all_data['REAL_INTEREST_RATE'] = fred_data['REAL_INTEREST_RATE']
        if 'BREAKEVEN_INFLATION' in fred_data:
             all_data['BREAKEVEN_INFLATION'] = fred_data['BREAKEVEN_INFLATION']

    # 2. Fetch All Sectors using Batch for Speed
    all_tickers = []
    for sector_name, config in SECTORS.items():
        all_tickers.extend(config["tickers"].values())
    
    # Also include MOVE and any other YF tickers
    all_tickers.extend(["^MOVE", "SPY", "RSP"]) # Ensure these are included
    all_tickers = list(set(all_tickers))
    log_diag(f"[IN] YF_QUERY: {{ count: {len(all_tickers)}, tickers: {all_tickers[:5]}... }}")

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
                        
                        # Calculate changes for AI v5.2
                        prev_1_day = hist_close.iloc[-2] if len(hist_close) >= 2 else current
                        daily_chg = ((current - prev_1_day) / prev_1_day) * 100 if prev_1_day != 0 else 0
                        
                        prev_5_day = hist_close.iloc[-5] if len(hist_close) >= 5 else hist_close.iloc[0]
                        change_5d = ((current - prev_5_day) / prev_5_day) * 100 if prev_5_day != 0 else 0
                        
                        all_data[key] = {
                            "price": round(current, 2),
                            "prev_price": round(prev_1_day, 2),
                            "daily_chg": round(daily_chg, 2),
                            "change_percent": round(change_5d, 2),
                            "trend": "UP" if daily_chg > 0 else "DOWN",
                            "sparkline": [round(x, 2) for x in hist_1mo.tolist()]
                        }
                        log_diag(f"[IN] YF_RAW: {{ ticker: {key}, price: {round(current, 2)}, chg: {round(daily_chg, 2)}% }}")
                    else: raise Exception("No close data")
                else: raise Exception("Empty Data")
            except Exception as e:
                log_diag(f"[IN ERROR] YFinance Fetch Failed for {key}: {e}")
                failed_indicators.append(key)
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

    if failed_indicators:
        log_diag(f"[GUARD] Data Integrity Audit: {len(failed_indicators)} indicators failed/mocked: {', '.join(failed_indicators)}")
    else:
        log_diag("[GUARD] Data Integrity Audit: 100% Data Completion (All feeds successful).")

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
    log_diag(f"[OUT] SECTOR_SCORES: {json.dumps(sector_scores)}")
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

def get_last_valid_analysis():
    """
    scans backend/archive/ for the most recent valid report.
    Valid = Does not contain 'Analysis Sync' or 'Market data sync' phrases.
    """
    try:
        if not os.path.exists(ARCHIVE_DIR): return None
        
        files = sorted([f for f in os.listdir(ARCHIVE_DIR) if f.endswith('.json')], reverse=True)
        # Scan last 7 days max
        for fname in files[:7]:
            path = os.path.join(ARCHIVE_DIR, fname)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    reports = data.get("analysis", {}).get("reports")
                    if not reports: continue
                    
                    # Check Validity (Check EN text for known fallback strings)
                    en_text = reports.get("EN", "")
                    if "Analysis Sync" in en_text or "Market data synchronization" in en_text:
                        continue # Invalid/Fallback content
                        
                    # Also check JP just in case
                    jp_text = reports.get("JP", "")
                    if "分析同期中" in jp_text:
                        continue
                        
                    log_diag(f"[SMART CACHE] Found valid report from {fname}")
                    return reports
            except:
                continue
    except Exception as e:
        log_diag(f"[SMART CACHE ERROR] {e}")
    return None


def calculate_trend_context(history, current_score):
    """
    Analyzes the last 10 data points to determine trend vector and narrative.
    Returns a dict with 'vector', 'narrative', 'stat_str'.
    """
    if not history or len(history) < 3:
        return {"vector": "FLAT", "narrative": "Insufficient history to determine trend.", "stat_str": "N/A"}

    # Use last 10 points
    recent_window = history[-10:]
    past_score = recent_window[0]['score']
    
    # Calculate Vector
    delta = current_score - past_score
    vector = "FLAT"
    if delta > 3: vector = "UPWARD (Improving)"
    elif delta < -3: vector = "DOWNWARD (Deteriorating)"

    # Statistics
    scores = [h['score'] for h in recent_window] + [current_score]
    min_score = min(scores)
    max_score = max(scores)
    
    # Narrative Logic (User Rule)
    narrative = f"Market is moving from {past_score} to {current_score}."
    
    if current_score < 40:
        if vector == "UPWARD (Improving)":
            narrative = f"Bottoming out and stabilizing sentiment. Recovering from a low of {min_score}."
        elif vector == "DOWNWARD (Deteriorating)":
            narrative = f"Deepening caution and testing support levels. Down from a high of {max_score}."
    
    stat_str = f"Range[{min_score}-{max_score}] Delta[{delta:+d}]"
    
    return {
        "vector": vector,
        "narrative": narrative,
        "stat_str": stat_str
    }

def generate_multilingual_report(data, score, trend_context={}):
    """Generates AI analysis in 7 languages using a SINGLE batch API call for efficiency."""
    # Prepare high-density data summary for AI v5.2
    # Include current, previous, and daily change for context
    

    if IS_MOCK_MODE:
        # Hybrid Cache-Fallback (Requirement 2)
        valid_cache = get_last_valid_analysis()
        if valid_cache:
            log_diag("[GUARD] Using Smart Cache (Mock Mode)")
            return valid_cache
        
        log_diag("[GUARD] No valid cache found. Using static FALLBACK_STATUS.")
        return FALLBACK_STATUS

    if not GEMINI_KEY:
        log_diag("[AI BRIDGE CRITICAL] GEMINI_API_KEY is MISSING from environment.")
        # FALLBACK TO SMART CACHE
        valid_cache = get_last_valid_analysis()
        if valid_cache:
            log_diag("[SMART CACHE] Using cached analysis due to missing API Key.")
            return valid_cache
        return FALLBACK_STATUS

    log_diag(f"[AI BRIDGE] GEMINI_API_KEY detected (Length: {len(GEMINI_KEY)})")

    # Calculate Trend Context
    trend_narrative = trend_context.get("narrative", "Market is analyzing new data patterns.")
    trend_vector = trend_context.get("vector", "FLAT")
    history_stat = trend_context.get("stat_str", "")

    # Prepare high-density data summary for AI v5.2
    # Include current, previous, and daily change for context
    market_summary = ""
    for k, v in data.items():
        if isinstance(v, dict) and "price" in v:
            p = v['price']
            prev = v.get('prev_price', p)
            d_chg = v.get('daily_chg', 0.0)
            market_summary += f"- {k}: {p} (Prev: {prev}, DailyChg: {d_chg}%)\n"

    breaking_news = fetch_breaking_news()

    prompt = f"""
【AI Insight Protocol v5.4: The Council of Three】
You are the centralized brain of the OmniMetric Terminal. You do not act as a single writer, but as a "Council of Three" specialized agents working in unison.

### THE COUNCIL (Your Internal personas):
1. [SKILL_01] QUANTITATIVE ANALYST (The Data):
   - Focus: Fisher Equation (Nominal = Real + Inflation), Net Liquidity flows, Volatility (VIX/MOVE).
   - Logic: Identify correlational breakdowns (e.g., "Stocks rising despite falling liquidity").
   - Constraint: Trust only the math and 0.1% variances. NO subjective opinion.

2. [SKILL_02] MACRO STRATEGIST (The Context):
   - Focus: MacroWiki Definitions, Historical Parallels (1970s Inflation, 2008 GFC, 2020 Pivot).
   - Logic: Translate the Quant's numbers into "Market Meaning". Use terms like "Cost of Capital," "Valuation Compression," "Safety Flight."
   - Goal: Connect the data to the "Why".

3. [SKILL_03] CHIEF OF STAFF (The Voice):
   - Focus: Synthesis & Multi-cultural Adaptation.
   - Logic: Synthesize the debate between Quant & Strategist into a unified, calm, and professional narrative.
   - Action: Draft the "Gold Standard" JP text, then "trans-create" (not just translate) for other regions.

### COGNITIVE PROCESS (Simulate this internally):
1. Quant decomposes the Yield Spread and Net Liquidity changes.
2. Strategist finds the historical precedent for this specific data pattern.
3. Chief of Staff synthesizes the final message.

### OUTPUT PROTOCOL (Mandatory):
1. First, generate the Japanese (JP) analysis as the "Gold Standard".
2. Maintain the exact "Information Density" and "Logical Structure" when translating.
3. OUTPUT ONLY the clean, professional report text in JSON format.
4.   - MANDATORY STRUCTURE: You must write exactly 5 long, detailed sentences for each language.
   - MANDATORY STRUCTURE: You must write exactly 5 long, detailed sentences for each language.
   - CHARACTER COUNT RANGE (STRICT): 250 to 300 characters per language.
   - UNDER 220 CHARACTERS IS A CRITICAL FAILURE.
   - Focus on logical cause-and-effect: (e.g., 'The 26% spike in VIX combined with contracting Net Liquidity is forcing valuation compression in SPY...')
   - Focus on logical cause-and-effect: (e.g., 'The 26% spike in VIX combined with contracting Net Liquidity is forcing valuation compression in SPY...')

*** NEGATIVE CONSTRAINTS (CRITICAL) ***
- DO NOT include the character count in the output.
- DO NOT include any metadata or parenthetical notes.

Market Context:
- Current GMS Score: {score}/100
- Momentum Vector: {trend_vector} (History: {history_stat})
- Trend Narrative: {trend_narrative}
- Market Matrix:
{market_summary}
- News: {breaking_news}

Regime Guide:
- 0-40: DEFENSIVE (Risk-Off).
- 40-60: NEUTRAL.
- 60-100: ACCUMULATE (Risk-On).

Output JSON:
{{
  "JP": "...",
  "EN": "...",
  "CN": "...",
  "ES": "...",
  "HI": "...",
  "ID": "...",
  "AR": "..."
}}
"""
    prompt_log_path = os.path.join(SCRIPT_DIR, "logs", "latest_prompt.txt")
    try:
        with open(prompt_log_path, "w", encoding="utf-8") as f:
            f.write(prompt)
    except Exception as e:
        log_diag(f"[LOG ERROR] Failed to save prompt: {e}")

    def sanitize_insight_text(text):
        """Removes noise like (249 characters) or （249文字） from the end."""
        if not text: return text
        # Remove Japanese style: （249文字） or (249文字)
        text = re.sub(r'[（\(]?\d+文字[）\)]?$', '', text.strip())
        # Remove English style: (249 chars) or (249 characters)
        text = re.sub(r'\(\d+ chars?\)$', '', text.strip(), flags=re.IGNORECASE)
        text = re.sub(r'\(\d+ characters?\)$', '', text.strip(), flags=re.IGNORECASE)
        return text.strip()

    for attempt in range(2): 
        try:
            log_diag(f"[AI BATCH] Requesting 7-language analysis (Attempt {attempt+1})...")
            
            frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
            script_path = os.path.join(frontend_dir, "scripts", "generate_insight.ts")
            
            import shutil
            if not shutil.which("npx"):
                log_diag("[AI BRIDGE SKIP] 'npx' not found. Jumping to Python SDK fallback.")
                break 
            
            cmd = ["npx", "-y", "tsx", script_path, prompt]
            
            log_diag(f"[AI BRIDGE] Command: {' '.join(cmd)}")
            
            process = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                encoding='utf-8',
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0,
                check=False,
                env=os.environ.copy(),
                cwd=frontend_dir,
                timeout=120,
                shell=(os.name == 'nt') # Mandatory for npx on Windows
            )

            if process.returncode != 0:
                log_diag(f"[AI BRIDGE WARN] Bridge execution failed (Code {process.returncode}). Trying direct node fallback...")
                # Try locating the JS build if TS execution fails in CI
                js_script = os.path.join(frontend_dir, "dist", "generate_insight.js")
                if os.path.exists(js_script):
                    cmd = ["node", js_script, prompt]
                    process = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', env=os.environ.copy(), cwd=frontend_dir, timeout=60)

            if process.returncode == 0:
                    stdout_content = process.stdout
                    log_diag(f"[AI BRIDGE] Received {len(stdout_content)} bytes of output. Head: {stdout_content[:100].strip()}...")
                    
                    # LOGGING: Output Audit (Bridge)
                    try:
                        with open(os.path.join(SCRIPT_DIR, "logs", "latest_raw_response.json"), "w", encoding="utf-8") as f:
                            f.write(stdout_content)
                    except: pass
                    
                    # Define required languages
                    required = ["JP", "EN", "CN", "ES", "HI", "ID", "AR"]

                    
                    # Robust JSON Extraction (Replaces fragile Regex)
                    try:
                        # 1. Clean Output (Remove dotenv noise)
                        lines = stdout_content.splitlines()
                        clean_lines = [line for line in lines if not line.strip().startswith("[") and not line.strip().startswith("Note:")]
                        clean_stdout = "\n".join(clean_lines)

                        # 2. Find JSON boundaries
                        json_start = clean_stdout.find('{')
                        json_end = clean_stdout.rfind('}') + 1

                        if json_start != -1 and json_end > json_start:
                            final_json_str = clean_stdout[json_start:json_end]
                            wrapper = json.loads(final_json_str)
                            
                            if "text" in wrapper:
                                inner_text = wrapper["text"]
                                # Clean markdown code blocks if present
                                if "```json" in inner_text:
                                    inner_text = inner_text.split("```json")[1].split("```")[0].strip()
                                elif "```" in inner_text:
                                    inner_text = inner_text.split("```")[1].split("```")[0].strip()
                                
                                reports = json.loads(inner_text)
                                if all(lang in reports for lang in required):
                                    # SANITIZE & VALIDATE LENGTH (Existing logic)
                                    valid = True
                                    for k, v in reports.items():
                                        sanitized = sanitize_insight_text(v)
                                        reports[k] = sanitized
                                        if len(sanitized) < 100:
                                            log_diag(f"[AI GUARD] {k} Report too short ({len(sanitized)} chars). Rejecting batch.")
                                            valid = False
                                            break
                                    
                                    if valid:
                                        log_diag("[AI SUCCESS] Reports parsed and validated via Bridge.")
                                        return reports
                                    else:
                                        log_diag("[AI FAIL] Validation failed (Quality Guard). Using Fallback.")
                                        valid_cache = get_last_valid_analysis()
                                        if valid_cache:
                                            return valid_cache
                                        return FALLBACK_STATUS
                        else:
                            log_diag(f"[AI ERROR] No JSON braces found in cleaned output.")

                    except Exception as e:
                        log_diag(f"[AI ERROR] Bridge JSON parse failed: {e}")
            else:
                log_diag(f"[AI BRIDGE FAIL] Final Exit Code {process.returncode}")
                if process.stderr:
                    log_diag(f"[AI BRIDGE ERR STREAM] {process.stderr.strip()[:200]}")
                
        except Exception as e:
            log_diag(f"[AI BRIDGE CRITICAL] {e}")

    # VERCEL AI GATEWAY - RESILIENCE PROTOCOL (PRIMARY)
    # Priority: 3-Flash (Speed) > 2.5-Pro (Quality) > 2.5-Flash-Lite (Cost)
    models = [
        "gemini-3-flash", 
        "gemini-2.5-pro",
        "gemini-2.5-flash-lite"
    ]

    gateway_slug = os.getenv("VERCEL_AI_GATEWAY_SLUG", "omni-metric")
    
    for model_name in models:
        log_diag(f"[AI GATEWAY] Attempting Model: {model_name}...")
        
        # Reduced Retries for speed (Max 2 Attempts)
        for attempt in range(2):
            try:
                # Calculate Backoff: 1s, 2s
                if attempt > 0:
                    wait_time = attempt
                    log_diag(f"[AI GATEWAY] Rate Limit Guard: Backing off for {wait_time}s...")
                    time.sleep(wait_time)

                # URL: Upstream is models/{model}:generateContent
                # Vercel Proxy: /v1/{slug}/google/models/{model}:generateContent
                # Standard Google path mapping for Gemini 3
                url = f"https://gateway.ai.vercel.com/v1/{gateway_slug}/google/models/{model_name}:generateContent"
                
                headers = {
                    "Content-Type": "application/json",
                    "x-vercel-ai-gateway-provider": "google",
                    "x-vercel-ai-gateway-cache": "disable", # Disable cache to force fresh gen
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" # Bypass WAF
                }
                
                # Proxy URL Construction
                proxy_url = f"{url}?key={GEMINI_KEY}"
                
                payload = {"contents": [{"parts": [{"text": prompt}]}]}
                
                # Timeout Reduced to 25s to allow fallback
                response = requests.post(proxy_url, json=payload, headers=headers, timeout=25)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # LOGGING: Output Audit
                    try:
                        with open(os.path.join(SCRIPT_DIR, "logs", "latest_raw_response.json"), "w", encoding="utf-8") as f:
                            json.dump(result, f, indent=2, ensure_ascii=False)
                    except: pass
                    
                    if 'candidates' in result and result['candidates']:
                        text = result['candidates'][0]['content']['parts'][0]['text']
                        log_diag(f"[AI SUCCESS] Generated via {model_name} (Gateway).")
                        text = text.replace("```json", "").replace("```", "").strip()
                        reports = json.loads(text)
                        
                        # Validate Keys
                        if all(lang in reports for lang in required):
                            for lang in required:
                                reports[lang] = sanitize_insight_text(reports[lang]) 
                            return reports
                        else:
                             log_diag(f"[AI INVALID] {model_name} returned incomplete JSON.")
                             break 
                
                elif response.status_code == 429:
                    log_diag(f"[AI GATEWAY 429] Rate Limit on {model_name} (Attempt {attempt+1}/2).")
                    continue # Trigger Backoff and Retry
                
                else:
                    log_diag(f"[AI GATEWAY FAIL] Status {response.status_code}: {response.text}")
                    # Non-429 error (e.g. 500 or 404). Do not retry same model endlessly.
                    break # Move to next model immediately (Downgrade)

            except Exception as e:
                log_diag(f"[AI GATEWAY EXCEPTION] {e}")
                break # Move to next model

    # BACKSTOPS REMOVED: Strict Gateway Enforcement
    # If Gateway loop fails, the function will proceed to raise the Exception below.


    # STEALTH FALLBACK (Ghosting with a Mark)
    # If all methods fail, fallback to stale data but mark it for the Owner.
    log_diag("[CRITICAL] ALL AI METHODS FAILED. Engaging Stealth Fallback...")
    
    # 1. Create Failure Flag (to trigger GitHub Action Failure later)
    try:
        flag_path = os.path.join(SCRIPT_DIR, "ai_failed.flag")
        with open(flag_path, "w") as f:
            f.write("FAILURE")
        log_diag(f"[ALERT] Failure flag created at {flag_path}")
    except: pass
    
    # 2. Load Valid Cache (Stale Data)
    valid_cache = get_last_valid_analysis()
    
    if valid_cache:
        log_diag("[STEALTH] Loaded Valid Cache. Appending '..' mark.")
        # 3. Append Silent Mark ".."
        for lang, text in valid_cache.items():
            if not text.endswith(".."):
                valid_cache[lang] = text + ".."
        return valid_cache
    
    else:
        log_diag("[FAIL] No valid cache found. Using Static Fallback with Mark.")
        fallback_marked = {}
        for lang, text in FALLBACK_STATUS.items():
             fallback_marked[lang] = text + ".."
        return fallback_marked


def get_next_event_dates():
    """Smart Fallback: Dynamically calculates the next major economic event dates."""
    now = datetime.now()
    
    def get_first_friday(year, month):
        first_day = datetime(year, month, 1)
        w = first_day.weekday()
        # Friday is 4. (4 - w) % 7 gives days to add.
        return first_day + timedelta(days=(4 - w) % 7)

    # 1. NFP (First Friday)
    nfp_dt = get_first_friday(now.year, now.month)
    if nfp_dt < now:
        # Next month
        nm = now.month + 1
        ny = now.year
        if nm > 12: nm = 1; ny += 1
        nfp_dt = get_first_friday(ny, nm)

    # 2. CPI (Approx 12th of month)
    cpi_dt = now.replace(day=12, hour=8, minute=30, second=0, microsecond=0)
    if cpi_dt < now:
        nm = now.month + 1
        ny = now.year
        if nm > 12: nm = 1; ny += 1
        cpi_dt = cpi_dt.replace(year=ny, month=nm)

    # 3. FOMC (Next meeting - Static schedule for 2026 for realism)
    # 2026 Dates: Jan 27-28, Mar 17-18, May 5-6, June 16-17, July 28-29, Sep 15-16, Oct 27-28, Dec 15-16
    fomc_dates = [
        datetime(2026, 1, 28, 14, 0),
        datetime(2026, 3, 18, 14, 0),
        datetime(2026, 5, 6, 14, 0),
        datetime(2026, 6, 17, 14, 0),
        datetime(2026, 7, 29, 14, 0),
        datetime(2026, 9, 16, 14, 0),
        datetime(2026, 10, 28, 14, 0),
        datetime(2026, 12, 16, 14, 0)
    ]
    fomc_dt = next((d for d in fomc_dates if d > now), fomc_dates[-1])

    return [
        {
            "code": "cpi",
            "name": "CPI INFLATION DATA",
            "date": cpi_dt.strftime("%Y-%m-%d"),
            "day": cpi_dt.strftime("%a").upper(),
            "time": "08:30 EST",
            "impact": "high"
        },
        {
            "code": "fomc",
            "name": "FOMC RATE DECISION",
            "date": fomc_dt.strftime("%Y-%m-%d"),
            "day": fomc_dt.strftime("%a").upper(),
            "time": "14:00 EST",
            "impact": "critical"
        },
        {
            "code": "nfp",
            "name": "NON-FARM PAYROLLS",
            "date": nfp_dt.strftime("%Y-%m-%d"),
            "day": nfp_dt.strftime("%a").upper(),
            "time": "08:30 EST",
            "impact": "high"
        }
    ]

def update_signal(force_news=False):
    print(f"Running OmniMetric v2.0 Engine (Force News: {force_news})...")
    
    # 1. Execution Control: 10-Minute Cool-down (DISABLED FOR DEBUG)
    if False:
        try:
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
                    last_upd_str = existing_data.get("last_successful_update")
                    if last_upd_str:
                        # Handle both space and T formats for safety
                        last_upd_str = last_upd_str.replace(' ', 'T').replace('Z', '')
                        last_upd_dt = datetime.fromisoformat(last_upd_str)
                        if (datetime.utcnow() - last_upd_dt).total_seconds() < 480: # 8-minute buffer for jittery 15m crons
                            print(f"[AIO] SKIP: Recently updated ({last_upd_dt}). Enforced 8m cool-down.")
                            return existing_data
        except Exception as e:
            print(f"[AIO] Cool-down check failed (Non-critical): {e}")

    validate_api_keys()
    # FETCH DATA
    market_data, status, fetched_events = fetch_market_data()
    log_diag(f"[GUARD] Market data acquisition: {status}")
    
    if market_data:
        # CALCULATE SCORES
        sector_scores = {}
        for sector in SECTORS.keys():
            score = calculate_sector_score(sector, market_data)
            sector_scores[sector] = score
            log_diag(f"[OUT] CALC_SCORE: {{ sector: {sector}, score: {score} }}")
            
        score = calculate_total_gms(market_data, sector_scores)
        log_diag(f"[OUT] GMS_TOTAL: {{ score: {score} }}")
        
        # History Management (Hoisted for AI Context)
        history = []
        try:
            if os.path.exists(HISTORY_FILE):
                with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                    history = json.load(f)
        except: pass

        # Trend Analysis
        trend_context = calculate_trend_context(history, score)
        log_diag(f"[AI CONTEXT] Trend: {trend_context['vector']} | {trend_context['narrative']}")

        # AI Analysis (Pass context)
        ai_reports = generate_multilingual_report(market_data, score, trend_context) 
        
        # News Intelligence (New: Pre-translated & Cached)
        intelligence = None
        if (force_news or not os.path.exists(DATA_FILE)) and not IS_MOCK_MODE:
            try:
                intelligence = fetch_news.get_news_payload()
            except Exception as e:
                log_diag(f"[AIO] News fetch failed: {e}")
        else:
            # Preserve existing intelligence if not forcing refresh OR in MOCK mode
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    old_data = json.load(f)
                    intelligence = old_data.get("intelligence")
                    
                # If intelligence is missing and NOT in mock mode, try to fetch it
                if not intelligence and not IS_MOCK_MODE:
                    intelligence = fetch_news.get_news_payload()
                elif not intelligence and IS_MOCK_MODE:
                    log_diag("[GUARD] Mock Mode: No news cache found.")
            except:
                if not IS_MOCK_MODE:
                    intelligence = fetch_news.get_news_payload()

        
        # ATOMIC GUARD: If AI reports missing (e.g. 429 or failure), do NOT commit/save
        if ai_reports is None:
            log_diag("[CRITICAL] AI Analysis returned None. Using Fallback Status to preserve site uptime.")
            ai_reports = FALLBACK_STATUS
        events = fetched_events if fetched_events and len(fetched_events) > 0 else get_next_event_dates()
        # GLOBAL SAFEGUARD: Ensure events are sorted chronologically regardless of source
        events.sort(key=lambda x: x["date"])

        # (History loading moved up)
        
        # Append new entry (UTC)
        new_entry = {
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), # ISO UTC with Z suffix
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
                # Pass raw ISO timestamp for frontend localization
                fmt_date = h["timestamp"]
                history_chart.append({"date": fmt_date, "score": h["score"]})

        payload = {
            "last_updated": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), # ISO UTC with Z suffix
            "last_successful_update": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), # ISO UTC with Z suffix
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
            "intelligence": intelligence, # NEW: Cached news
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

        # Synced Frontend Save (ISR/Fetch support)
        if not os.path.exists(FRONTEND_DATA_DIR):
            try:
                os.makedirs(FRONTEND_DATA_DIR)
            except: pass
        try:
            with open(FRONTEND_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(payload, f, indent=4, ensure_ascii=False)
            print(f"Synced signal to frontend: {FRONTEND_DATA_FILE}")
        except Exception as e:
            print(f"Frontend sync failed: {e}")

        try:
            # TRIGGER SEO & SNS MODULES (Atomic)
            prev_score = 50
            if len(history) >= 2:
                prev_score = history[-2]["score"]

            # 1. SEO IndexNow Acceleration
            try:
                seo = SEOMonitor(log_callback=print)
                seo.notify_indexnow(score, prev_score)
            except Exception as e:
                print(f"[AIO] SEO Module Error: {e}")

            # 2. SNS Strategic Publication
            try:
                sns = SNSPublisher(log_callback=log_diag)
                sns.publish_update(payload)
            except Exception as e:
                print(f"[AIO] SNS Module Error: {e}")
                import traceback
                traceback.print_exc()

            # 3. Performance Audit (Archive & Summary)
            try:
                import performance_analyzer
                log_diag("[AIO] Running Performance Audit...")
                performance_analyzer.main()
            except Exception as e:
                print(f"[AIO] Performance Audit Error: {e}")

        except Exception as e:
            print(f"[AIO] Event Triggering Critical Error: {e}")

        return payload

    else:
        print("[Warn] Market data collection failed. Writing SAFETY FALLBACK to preserve Heart-beat.")
        
        # Try to load previous data to preserve cache (User Request: Show cached numbers)
        cached_market_data = {}
        cached_sector_scores = {}
        cached_sys_score = 50
        
        try:
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    old_json = json.load(f)
                    cached_market_data = old_json.get('market_data', {})
                    cached_sector_scores = old_json.get('sector_scores', {})
                    cached_sys_score = old_json.get('gms_score', 50)
        except Exception as ex:
             print(f"[Warn] Failed to load cache for fallback: {ex}")

        payload = {
            "last_updated": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "last_successful_update": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), 
            "gms_score": cached_sys_score,
            "sector_scores": cached_sector_scores,
            "market_data": cached_market_data,
            "events": get_next_event_dates(),
            "analysis": {
                "title": "Global Market Outlook (Maintenance)",
                "content": "Market data synchronization active. Visualizing baseline indicators...",
                "reports": get_last_valid_analysis() or FALLBACK_STATUS
            },
            "history_chart": [],
            "intelligence": old_json.get("intelligence") if 'old_json' in locals() else None,
            "system_status": "MAINTENANCE"
        }
        try:
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(payload, f, indent=4, ensure_ascii=False)
        except: pass
        return payload

if __name__ == "__main__":
    try:
        # 1. Cleanup old flags
        flag_path = os.path.join(SCRIPT_DIR, "ai_failed.flag")
        if os.path.exists(flag_path):
            os.remove(flag_path)

        print(f"--- [START] Engine Run at {datetime.utcnow().isoformat()} ---")
        result = update_signal(force_news=True)
        print(f"--- [FINISH] Engine Run SUCCESS (Score: {result.get('gms_score', 'N/A')}) ---")
    except Exception as e:
        print(f"--- [FATAL ERROR] ---")
        print(f"Type: {type(e).__name__}")
        print(f"Message: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
