import requests
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta, timezone

# Load env
load_dotenv()
ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "").strip() 
FINNHUB_KEY = os.getenv("FINNHUB_API_KEY", "").strip()

def test_alpha_vantage():
    print(f"\n--- Testing Alpha Vantage Economic Calendar ---")
    if not ALPHA_VANTAGE_KEY:
        print("[SKIP] ALPHA_VANTAGE_API_KEY not set.")
        return
    
    url = f"https://www.alphavantage.co/query?function=ECONOMIC_CALENDAR&apikey={ALPHA_VANTAGE_KEY}"
    try:
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            # Alpha Vantage returns CSV or JSON depending on function, but ECONOMIC_CALENDAR is typically CSV
            print("Response Length:", len(response.text))
            print("Preview:", response.text[:200])
        else:
            print("Error:", response.text)
    except Exception as e:
        print("Exception:", e)

def test_finnhub():
    print(f"\n--- Testing Finnhub Economic Calendar ---")
    if not FINNHUB_KEY:
        print("[SKIP] FINNHUB_API_KEY not set.")
        return
        
    url = f"https://finnhub.io/api/v1/calendar/economic?token={FINNHUB_KEY}"
    try:
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Count: {len(data.get('economicCalendar', []))}")
            if data.get('economicCalendar'):
                print("First Item:", json.dumps(data['economicCalendar'][0], indent=2))
        else:
            print("Error:", response.text)
    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    test_alpha_vantage()
    test_finnhub()
