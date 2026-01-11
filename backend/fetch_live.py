import yfinance as yf
import json
import sys

def get_live_data():
    tickers = ['^VIX', '^TNX', 'SPY', 'DX-Y.NYB', 'BTC-USD']
    data = {}
    
    try:
        # Fetch data in bulk or loop. Bulk is better but names differ.
        # yf.download is noisy. Use Ticker to get fast info or history(period='1d').
        
        for t in tickers:
            try:
                tick = yf.Ticker(t)
                # fast_info is suitable for latest price
                price = tick.fast_info.last_price
                prev_close = tick.fast_info.previous_close
                
                if price is None:
                    # Fallback to history
                    hist = tick.history(period="1d")
                    if not hist.empty:
                        price = hist['Close'].iloc[-1]
                        # Need prev close from yesterday
                        hist5 = tick.history(period="5d")
                        if len(hist5) >= 2:
                            prev_close = hist5['Close'].iloc[-2]
                        else:
                            prev_close = price
                
                change = price - prev_close
                change_pct = (change / prev_close) * 100 if prev_close else 0.0
                
                clean_key = t
                if t == '^VIX': clean_key = 'VIX'
                if t == '^TNX': clean_key = 'TNX'
                if t == 'DX-Y.NYB': clean_key = 'DXY'
                
                data[clean_key] = {
                    "price": round(price, 2),
                    "change": round(change, 2),
                    "change_percent": round(change_pct, 2)
                }
            except Exception as e:
                pass
                
        print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    get_live_data()
