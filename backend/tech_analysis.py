
import yfinance as yf
import pandas as pd
import pandas_ta as ta
import json
import os
import numpy as np
from datetime import datetime, timedelta

# Configuration
SYMBOLS = {
    "DXY": "DX-Y.NYB",
    "US10Y": "^TNX",
    "SPX": "^GSPC"
}

INTERVALS = {
    "1h": "1h",
    "4h": "1h", # Strategy: Fetch 1h, resample to 4h
    "Daily": "1d",
    "Weekly": "1wk",
    "Monthly": "1mo"
}

# Data Limiting Rules
LIMITS = {
    "1h": timedelta(days=30),
    "4h": timedelta(days=730),
    "Daily": timedelta(days=730),
    "Weekly": timedelta(days=730 * 2),
    "Monthly": timedelta(days=730 * 5)
}

OUTPUT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "public", "data", "market_analysis.json")

class MarketDataEncoder(json.JSONEncoder):
    """Custom JSON encoder to handle numpy types and other pandas artifacts."""
    def default(self, obj):
        if isinstance(obj, (np.integer, np.floating)):
            if np.isnan(obj) or np.isinf(obj):
                return None
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, (datetime, pd.Timestamp)):
            return obj.isoformat()
        return super(MarketDataEncoder, self).default(obj)

def fetch_and_process(symbol_code, interval_name):
    yf_interval = INTERVALS[interval_name]
    
    period = "2y"
    if interval_name == "1h":
        period = "1mo"
    elif interval_name in ["Daily", "Weekly", "Monthly"]:
        period = "5y"
    
    # Special handling for 4h resampling
    is_4h = (interval_name == "4h")
    if is_4h:
        yf_interval = "1h"
        period = "2y" 

    try:
        # Fetch data - disable threads to avoid issues in CI
        print(f"  Downloading {symbol_code} ({yf_interval}) for period {period}...")
        df = yf.download(symbol_code, interval=yf_interval, period=period, progress=False, auto_adjust=True, threads=False)
        
        if df.empty:
            print(f"  Warning: No data returned for {symbol_code} {interval_name}")
            return []

        # Handle MultiIndex columns (yfinance > 0.2)
        if isinstance(df.columns, pd.MultiIndex):
            try:
                df.columns = df.columns.get_level_values(0)
            except Exception as e:
                print(f"  Note: Failed to flatten MultiIndex for {symbol_code}: {e}")
        
        # Ensure we have required columns
        required_cols = ['Open', 'High', 'Low', 'Close', 'Volume']
        if not all(col in df.columns for col in required_cols):
             print(f"  Error: Missing required columns in {df.columns} for {symbol_code}")
             return []

        # Resample logic if needed
        if is_4h:
            agg_dict = {
                'Open': 'first',
                'High': 'max',
                'Low': 'min',
                'Close': 'last',
                'Volume': 'sum'
            }
            if 'Adj Close' in df.columns:
                 df = df.drop(columns=['Adj Close'])
            df = df.resample('4h').agg(agg_dict).dropna()

        # Date Filtering
        cutoff = datetime.now() - LIMITS.get(interval_name, timedelta(days=730))
        if df.index.tz is not None:
            df.index = df.index.tz_localize(None)
        cutoff = cutoff.replace(tzinfo=None)

        df = df[df.index >= cutoff]
        
        if len(df) < 5:
            print(f"  Warning: Insufficient data points ({len(df)}) for {symbol_code} {interval_name}")
        
        # --- Indicators ---
        df['SMA_200'] = ta.sma(df['Close'], length=200)
        df['SMA_25'] = ta.sma(df['Close'], length=25)
        
        bb = ta.bbands(df['Close'], length=20, std=2)
        if bb is not None:
            def get_col(prefix):
                for c in bb.columns:
                    if c.startswith(prefix):
                        return c
                return None
            
            upper = get_col("BBU")
            middle = get_col("BBM")
            lower = get_col("BBL")
            
            if upper and middle and lower:
                df['BB_upper'] = bb[upper]
                df['BB_middle'] = bb[middle]
                df['BB_lower'] = bb[lower]

        df['RSI'] = ta.rsi(df['Close'], length=14)
        df['Deviation'] = ((df['Close'] - df['SMA_200']) / df['SMA_200']) * 100
        
        # Clean up NaNs for indicator startup
        df = df.dropna(subset=['SMA_25']) # We allow SMA200 to be NaN for shorter histories, but SMA25 should be there
        
        result_data = []
        for idx, row in df.iterrows():
            time_val = int(idx.timestamp())
            
            item = {
                "time": time_val,
                "open": row['Open'],
                "high": row['High'],
                "low": row['Low'],
                "close": row['Close'],
                "volume": row['Volume'],
                "sma200": row.get('SMA_200'),
                "sma25": row.get('SMA_25'),
                "bb_upper": row.get('BB_upper'),
                "bb_middle": row.get('BB_middle'),
                "bb_lower": row.get('BB_lower'),
                "rsi": row.get('RSI'),
                "deviation": row.get('Deviation')
            }
            # The custom encoder handles NaNs, but we can be explicit here too
            processed_item = {}
            for k, v in item.items():
                if pd.isna(v) or v is None:
                    processed_item[k] = None
                else:
                    processed_item[k] = v
            result_data.append(processed_item)
            
        print(f"  Success: Processed {len(result_data)} candles for {symbol_code} {interval_name}")
        return result_data

    except Exception as e:
        print(f"  Error processing {symbol_code} {interval_name}: {e}")
        import traceback
        traceback.print_exc()
        return []

def main():
    print(f"Starting Market Analysis Update at {datetime.now().isoformat()}")
    final_output = {}
    
    for sym_name, sym_code in SYMBOLS.items():
        print(f"--- Symbol: {sym_name} ({sym_code}) ---")
        final_output[sym_name] = {}
        for interval in INTERVALS.keys():
            print(f" Processing interval: {interval}...")
            data = fetch_and_process(sym_code, interval)
            final_output[sym_name][interval] = data
            
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    print(f"Saving data to {OUTPUT_PATH}...")
    try:
        with open(OUTPUT_PATH, 'w') as f:
            json.dump(final_output, f, cls=MarketDataEncoder)
        print(f"SUCCESS: Data saved. File size: {os.path.getsize(OUTPUT_PATH)} bytes")
    except Exception as e:
        print(f"FATAL ERROR during JSON save: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == "__main__":
    main()
