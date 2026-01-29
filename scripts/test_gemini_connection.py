import os
import requests
import json
from dotenv import load_dotenv

# Load env from multiple possible locations for safety
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("[ERROR] GEMINI_API_KEY not found in environment.")
    exit(1)

print(f"[INFO] API Key found (Length: {len(API_KEY)})")

MODEL = "gemini-2.5-flash"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

payload = {
    "contents": [{
        "parts": [{"text": "Hello, simply reply with 'OK' if you can hear me."}]
    }]
}

headers = {"Content-Type": "application/json"}

try:
    print(f"[INFO] Sending request to {MODEL}...")
    response = requests.post(URL, json=payload, headers=headers, timeout=10)
    
    print(f"[INFO] Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        text = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
        print(f"[SUCCESS] Response received: {text.strip()}")
    else:
        print(f"[FAILURE] API Error: {response.text[:200]}")

except Exception as e:
    print(f"[ERROR] Exception occurred: {e}")
