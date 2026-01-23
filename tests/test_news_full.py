import sys
import os
import json
import requests

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    import fetch_news
except ImportError:
    print("[FAIL] Could not import fetch_news. check path.")
    sys.exit(1)

def test_news_full():
    print("--- [TEST] Testing New Fetch & Translation Logic ---")
    
    # 1. Test Raw Fetch (Date Parsing)
    print("\n--- Step 1: Fetching Raw RSS ---")
    items = fetch_news.fetch_raw_news()
    if not items:
        print("[FAIL] No items returned from RSS.")
    else:
        print(f"[SUCCESS] Got {len(items)} items.")
        print("Top 3 Dates (ISO):")
        for i in items[:3]:
            print(f" - {i['isoDate']} | {i['title'][:40]}...")

    # 2. Test Translation (Vercel Gateway)
    print("\n--- Step 2: Testing Vercel Gateway Translation ---")
    if not items:
        print("[SKIP] Cannot test translation without items.")
        return

    # Mock item for consistent testing if needed, or use real
    test_items = items[:2] # Translate top 2
    
    start = os.times().elapsed
    translations = fetch_news.translate_news_batch(test_items)
    end = os.times().elapsed
    
    print(f"Time Taken: {end - start:.2f}s")
    
    if translations:
        print("[SUCCESS] Translation returned data.")
        print(json.dumps(translations, indent=2, ensure_ascii=False)[:300] + "...")
        
        # Verify Keys
        keys = list(translations.keys())
        print(f"Languages: {keys}")
        if "JP" in keys and len(translations["JP"]) == len(test_items):
            print("[PASS] JP Translation count matches input.")
        else:
            print("[FAIL] Mismatch in translation count or missing keys.")
            
    else:
        print("[FAIL] Translation returned empty object. Check Gateway/Logs.")

if __name__ == "__main__":
    test_news_full()
