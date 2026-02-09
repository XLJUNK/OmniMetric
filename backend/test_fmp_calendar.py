import requests
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta, timezone

# Load env
load_dotenv()
FMP_KEY = os.getenv("FMP_API_KEY", "").strip()

def test_fmp_calendar():
    print(f"Testing FMP Economic Calendar API...")
    if not FMP_KEY:
        print("[ERROR] FMP_API_KEY is not set in .env")
        return

    start_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    end_date = (datetime.now(timezone.utc) + timedelta(days=45)).strftime("%Y-%m-%d")
    
    url = f"https://financialmodelingprep.com/api/v3/economic_calendar?from={start_date}&to={end_date}&apikey={FMP_KEY}"
    print(f"URL: {url.replace(FMP_KEY, 'REDACTED')}")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {json.dumps(dict(response.headers), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Data type: {type(data)}")
            if isinstance(data, list):
                print(f"Count: {len(data)}")
                if len(data) > 0:
                    print("First item sample:")
                    print(json.dumps(data[0], indent=2))
            else:
                print("Response is not a list:")
                print(data)
        else:
            print(f"Error Content: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_fmp_calendar()
