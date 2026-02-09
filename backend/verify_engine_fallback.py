from backend.gms_engine import fetch_economic_calendar
import json

def verify():
    print("--- Verifying Economic Calendar Fallback ---")
    
    # Debug: Check environment variables
    import os
    from dotenv import load_dotenv
    load_dotenv()
    av_key = os.getenv("ALPHA_VANTAGE_API_KEY", "")
    fh_key = os.getenv("FINNHUB_API_KEY", "")
    print(f"Alpha Vantage Key Found: {len(av_key) > 0}")
    print(f"Finnhub Key Found: {len(fh_key) > 0}")

    events = fetch_economic_calendar()
    print(f"Fetched {len(events)} events.")
    print(json.dumps(events, indent=2))
    
    if len(events) == 5:
        print("\n[SUCCESS] Smart Fallback returned 5 major events.")
        # Check for 2026 dates
        if all("2026" in e["date"] for e in events):
            print("[SUCCESS] All events are scheduled for 2026.")
    else:
        print("\n[FAILURE] Unexpected number of events.")

if __name__ == "__main__":
    verify()
