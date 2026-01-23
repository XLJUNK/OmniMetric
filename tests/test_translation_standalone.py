
import sys
import os
import json
import requests

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from fetch_news import translate_news_batch, GEMINI_KEY, GATEWAY_SLUG

print(f"--- DIAGNOSTIC START ---")
print(f"GEMINI_KEY Loaded: {bool(GEMINI_KEY)} (Length: {len(GEMINI_KEY)})")
print(f"GATEWAY_SLUG: {GATEWAY_SLUG}")

sample_items = [
    {"title": "Fed Chair Jerome Powell says interest rate cuts are coming in 2026", "link": "#", "isoDate": "2026-01-22T00:00:00Z"},
    {"title": "Nvidia stock hits all-time high as AI demand surges", "link": "#", "isoDate": "2026-01-22T00:00:00Z"}
]

print("\n--- RUNNING BATCH TRANSLATION ---")
try:
    result = translate_news_batch(sample_items)
    print("\n--- RESULT ---")
    print(json.dumps(result, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"\n--- FATAL ERROR ---")
    print(e)
    import traceback
    traceback.print_exc()

print("\n--- DIRECT GATEWAY CONNECTIVITY TEST ---")
model_name = "gemini-2.0-flash-001"
url = f"https://gateway.ai.vercel.com/v1/{GATEWAY_SLUG}/google/models/{model_name}:generateContent"
headers = {
    "Content-Type": "application/json",
    "x-vercel-ai-gateway-provider": "google",
    "x-vercel-ai-gateway-cache": "disable",
    "User-Agent": "Diagnostic-Script/1.0"
}
proxy_url = f"{url}?key={GEMINI_KEY}"
print(f"Target URL: {url} (Key Hidden)")

try:
    res = requests.post(proxy_url, json={"contents": [{"parts": [{"text": "Hello"}]}]}, headers=headers, timeout=10)
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text[:200]}...")
except Exception as e:
    print(f"Connection Failed: {e}")
