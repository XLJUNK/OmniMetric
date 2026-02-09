import os
import requests
from dotenv import load_dotenv
import datetime

load_dotenv()
av_key = "TJG5U0UYTV7KPNDO"
fh_full = "ctikbehr01qm6munakqgctikbehr01qm6munakr0"
fh_part1 = fh_full[:20]
fh_part2 = fh_full[20:]

def test_av():
    print("--- Testing Alpha Vantage (TJG5U0UYTV7KPNDO) ---")
    url = f"https://www.alphavantage.co/query?function=ECONOMIC_CALENDAR&apikey={av_key}"
    r = requests.get(url)
    print(f"AV Status: {r.status_code}")
    print(f"AV Content: {r.text[:200]}")

def test_fh(token, label):
    print(f"\n--- Testing Finnhub ({label}: {token}) ---")
    now = datetime.datetime.now()
    end = now + datetime.timedelta(days=7)
    url = f"https://finnhub.io/api/v1/calendar/economic?from={now.strftime('%Y-%m-%d')}&to={end.strftime('%Y-%m-%d')}&token={token}"
    r = requests.get(url)
    print(f"FH Status: {r.status_code}")
    print(f"FH Content: {r.text[:200]}")

if __name__ == "__main__":
    test_av()
    test_fh(fh_full, "Full 40 chars")
    test_fh(fh_part1, "Part 1 (20 chars)")
    test_fh(fh_part2, "Part 2 (20 chars)")
