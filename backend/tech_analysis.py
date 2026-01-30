
import yfinance as yf
import pandas as pd
import pandas_ta as ta
import json
import os
from datetime import datetime, timedelta

# Configuration
SYMBOLS = {
    "DXY": "DX-Y.NYB",
    "US10Y": "^TNX",
    "SPX": "^GSPC"
}

INTERVALS = {
    "1h": "1h",
    "4h": "1h", # yfinance 4h is not always reliable/available, constructing from 1h or just using 1h and resampling if needed? 
                # yfinance supports 1h. For 4h, we might need to resample or just fetch if available. 
                # yfinance API: valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
                # Standard free yfinance doesn't easily do 4h. 
                # Strategy: Fetch 1h, resample to 4h.
    "Daily": "1d",
    "Weekly": "1wk",
    "Monthly": "1mo"
}

# Data Limiting Rules
LIMITS = {
    "1h": timedelta(days=30),       # Approx 1 month
    "4h": timedelta(days=730),      # Approx 2 years
    "Daily": timedelta(days=730),
    "Weekly": timedelta(days=730 * 2), # 4 years for weekly to see trends? User said "Daily+ : 1-2 years". I'll stick to 2 years (730 days) or maybe a bit more for Weekly. 
    "Monthly": timedelta(days=730 * 5) # 10 years for monthly? Let's use 2 years min as requested, maybe 5 for monthly context.
}

OUTPUT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "public", "data", "market_analysis.json")

def fetch_and_process(symbol_code, interval_name):
    yf_interval = INTERVALS[interval_name]
    
    # yfinance limitations: 1h data only available for last 730 days. 
    # For '1h', we want last 1 month. 
    # For '4h' (resampled from 1h), we want last ~2 years? 
    # Wait, yfinance 1h data often limited to 730 days. 
    # If user wants 4h for 2 years, we need 1h data for 2 years. That's pushing the limit of free yfinance.
    # Let's try to fetch max period.
    
    period = "2y"
    if interval_name == "1h":
        period = "1mo" # User requested 1 month for 1h
    elif interval_name == "Daily" or interval_name == "Weekly" or interval_name == "Monthly":
        period = "5y" # Safe upper bound
    
    # Special handling for 4h resampling
    is_4h = (interval_name == "4h")
    if is_4h:
        yf_interval = "1h"
        period = "2y" 

    try:
        # Fetch data
        df = yf.download(symbol_code, interval=yf_interval, period=period, progress=False, auto_adjust=True) # auto_adjust checks for Adj Close
        
        if df.empty:
            print(f"Warning: No data for {symbol_code} {interval_name}")
            return []

        # Handle MultiIndex columns (yfinance > 0.2 returns MultiIndex generally)
        if isinstance(df.columns, pd.MultiIndex):
            # If 2 levels and 2nd level is Ticker, drop it
            try:
                df.columns = df.columns.get_level_values(0)
            except:
                pass
        
        # Ensure we have required columns
        required_cols = ['Open', 'High', 'Low', 'Close', 'Volume']
        if not all(col in df.columns for col in required_cols):
             print(f"Error: Missing columns {df.columns} for {symbol_code}")
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
            # Remove adj close if present or handle it
            if 'Adj Close' in df.columns:
                 df = df.drop(columns=['Adj Close'])
            
            df = df.resample('4h').agg(agg_dict).dropna()

        # Date Filtering (Post-fetch to ensure clean cut)
        cutoff = datetime.now() - LIMITS.get(interval_name, timedelta(days=730))
        # Ensure index is timezone aware/naive matching
        if df.index.tz is None:
            cutoff = cutoff.replace(tzinfo=None)
        else:
            # yfinance often returns UTC. Ensure cutoff is aware if needed, or make df naive
            # Easiest: make df naive
            df.index = df.index.tz_localize(None)
            cutoff = cutoff.replace(tzinfo=None)

        # Enforce strict data limits
        df = df[df.index >= cutoff]
        
        # --- Indicators ---
        # SMA 200, 25
        df['SMA_200'] = ta.sma(df['Close'], length=200)
        df['SMA_25'] = ta.sma(df['Close'], length=25)
        
        # BB (20, 2)
        bb = ta.bbands(df['Close'], length=20, std=2)
        if bb is not None:
            # print(f"BB Columns: {bb.columns}") # Debug
            # pandas_ta columns can vary. Usually BBL_length_std, BBM_..., BBU_...
            # But sometimes lower case or different.
            # Let's try to match dynamically or standard names.
            # BBU_20_2.0 is standard.
            
            # Helper to find column
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
            else:
                 print(f"Warning: BB columns not found: {bb.columns}")

        
        # RSI (14)
        df['RSI'] = ta.rsi(df['Close'], length=14)
        
        # Deviation %
        # (Price - SMA200) / SMA200 * 100
        df['Deviation'] = ((df['Close'] - df['SMA_200']) / df['SMA_200']) * 100
        
        # --- Divergence Logic ---
        # Pivot High/Low for price
        # We need check local extrema. 
        # Simple approach: Look at last N candles (e.g. 5).
        # A bit complex to do robustly on full history efficiently in one pass. 
        # We will iterate or use rolling.
        # Let's focus on "Recent" signals or full history flags? 
        # "Flag... in JSON". Ideally for the whole chart or just tip? 
        # For charting, usually we want to see past divergences too.
        
        # Simplified Divergence Detector:
        # Bearish: Price makes High > PrevHigh, but RSI < PrevRSIHigh
        # Bullish: Price makes Low < PrevLow, but RSI > PrevRSILow
        
        # This is heavy to do perfectly. We will implement a simplified localized version.
        # Find peaks/valleys in Price & RSI. 
        # If Price Peak(t) > Price Peak(t-k) AND RSI Peak(t) < RSI Peak(t-k) -> Bearish Div at t
        
        # Using a rolling window to detect local extrema
        window = 5
        df['is_high'] = df['Close'].rolling(window=window*2+1, center=True).max() == df['Close']
        df['is_low'] = df['Close'].rolling(window=window*2+1, center=True).min() == df['Close']
        
        # Now iterate to find divergences
        bullish_divs = []
        bearish_divs = []
        
        # Get indices of highs and lows
        highs = df[df['is_high']].index
        lows = df[df['is_low']].index
        
        # Check consecutive highs for Bearish Div
        # We need to look at the corresponding RSI values
        # This loop is fast enough for 1-2 years of data (approx 500-1000 rows).
        
        current_bull_flags = [False] * len(df)
        current_bear_flags = [False] * len(df)
        
        # Improve: Vectorized or just loop over peaks
        # For valid comparison, peaks should be somewhat close (not years apart).
        
        # Bearish
        last_high_idx = None
        for idx in highs:
            if last_high_idx is not None:
                # Check condition
                price_curr = df.loc[idx, 'Close']
                price_prev = df.loc[last_high_idx, 'Close']
                rsi_curr = df.loc[idx, 'RSI']
                rsi_prev = df.loc[last_high_idx, 'RSI']
                
                if price_curr > price_prev and rsi_curr < rsi_prev:
                    # Mark current idx as bearish div
                    # Find integer location
                    loc = df.index.get_loc(idx)
                    current_bear_flags[loc] = True
            
            last_high_idx = idx

        # Bullish
        last_low_idx = None
        for idx in lows:
            if last_low_idx is not None:
                price_curr = df.loc[idx, 'Close']
                price_prev = df.loc[last_low_idx, 'Close']
                rsi_curr = df.loc[idx, 'RSI']
                rsi_prev = df.loc[last_low_idx, 'RSI']
                
                if price_curr < price_prev and rsi_curr > rsi_prev:
                    loc = df.index.get_loc(idx)
                    current_bull_flags[loc] = True
                    
            last_low_idx = idx
            
        df['is_bullish_div'] = current_bull_flags
        df['is_bearish_div'] = current_bear_flags
        
        # Clean up NaNs
        df = df.dropna(subset=['SMA_200']) # Indicators need startup
        
        # Format for Lightweight Charts
        # Time needs to be string 'YYYY-MM-DD' for Daily+, or Timestamp for intraday
        # LWC supports UNIX timestamp. 
        
        result_data = []
        for idx, row in df.iterrows():
            # Time: Unix timestamp (seconds)
            time_val = int(idx.timestamp())
            
            # Use 'time' for LWC
            # Structure: 
            # { time, open, high, low, close, volume, sma200, sma25, rsi, ... }
            item = {
                "time": time_val,
                "open": row['Open'],
                "high": row['High'],
                "low": row['Low'],
                "close": row['Close'],
                "volume": row['Volume'],
                "sma200": row['SMA_200'],
                "sma25": row['SMA_25'],
                "bb_upper": row.get('BB_upper'),
                "bb_middle": row.get('BB_middle'),
                "bb_lower": row.get('BB_lower'),
                "rsi": row['RSI'],
                "deviation": row['Deviation'],
                "is_bullish": bool(row['is_bullish_div']),
                "is_bearish": bool(row['is_bearish_div'])
            }
            # Handle potential NaNs (JSON doesn't like NaN)
            processed_item = {}
            for k, v in item.items():
                if pd.isna(v):
                    processed_item[k] = None
                else:
                    processed_item[k] = v
            result_data.append(processed_item)
            
        return result_data

    except Exception as e:
        print(f"Error processing {symbol_code} {interval_name}: {e}")
        import traceback
        traceback.print_exc()
        return []

def main():
    final_output = {}
    
    for sym_name, sym_code in SYMBOLS.items():
        final_output[sym_name] = {}
        for interval in INTERVALS.keys():
            print(f"Processing {sym_name} {interval}...")
            data = fetch_and_process(sym_code, interval)
            final_output[sym_name][interval] = data
            
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(final_output, f)
        
    print(f"Data saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
