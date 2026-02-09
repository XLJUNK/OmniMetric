import os
import requests
from dotenv import load_dotenv

load_dotenv()
av_key = os.getenv("ALPHA_VANTAGE_API_KEY", "")
fh_key = os.getenv("FINNHUB_API_KEY", "")

def test_av():
    print("--- Testing Alpha Vantage raw response ---")
    url = f"https://www.alphavantage.co/query?function=ECONOMIC_CALENDAR&apikey={av_key}"
    r = requests.get(url)
    print(f"Status: {r.status_code}")
    print(f"Content Length: {len(r.text)}")
    print(f"Preview (first 500 chars):\n{r.text[:500]}")

def test_fh():
    print("\n--- Testing Finnhub raw response ---")
    import datetime
    now = datetime.datetime.now()
    end = now + datetime.timedelta(days=30)
    url = f"https://finnhub.io/api/v1/calendar/economic?from={now.strftime('%Y-%m-%d')}&to={end.strftime('%Y-%m-%d')}&token={fh_key}"
    r = requests.get(url)
    print(f"Status: {r.status_code}")
    print(f"Content Length: {len(r.text)}")
    print(f"Preview (first 500 chars):\n{r.text[:500]}")

if __name__ == "__main__":
    test_av()
    test_fh()
