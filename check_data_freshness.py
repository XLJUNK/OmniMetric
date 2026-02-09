import json
import os
from datetime import datetime

path = "frontend/public/data/market_analysis.json"
if os.path.exists(path):
    with open(path, 'r') as f:
        data = json.load(f)
    
    for symbol in data:
        print(f"Symbol: {symbol}")
        for interval in data[symbol]:
            candles = data[symbol][interval]
            if candles:
                last_time = candles[-1]['time']
                dt = datetime.fromtimestamp(last_time)
                print(f"  Interval: {interval}, Last candle: {dt.isoformat()}, Count: {len(candles)}")
            else:
                print(f"  Interval: {interval}, Empty")
else:
    print("File not found")
