
import os
import requests
import json
from dotenv import load_dotenv

# Load Env from frontend/.env.local
env_path = r"c:\Users\shingo_kosaka.ARGOGRAPHICS\Desktop\GlobalMacroSignal\frontend\.env.local"
if os.path.exists(env_path):
    print(f".env.local found at {env_path}")
    load_dotenv(env_path, override=True)
else:
    print(".env.local NOT found")

KEY = os.getenv("GEMINI_API_KEY")

print("--- GEMINI API KEY TEST (FRONTEND) ---")

if not KEY:
    print("CRITICAL: GEMINI_API_KEY is missing in frontend/.env.local")
else:
    print(f"API Key found: {KEY[:5]}...{KEY[-4:] if len(KEY)>5 else ''}")
    # Using v1beta for gemini-1.5-flash as it's generally stable
    m = "gemini-1.5-flash"
    version = "v1beta"
    
    print(f"Testing {version} / {m}...")
    url = f"https://generativelanguage.googleapis.com/{version}/models/{m}:generateContent?key={KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": "Reply with exactly 'API_WORKS'"}]}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"HTTP Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            try:
                text = data['candidates'][0]['content']['parts'][0]['text']
                print(f"Response Text: {text.strip()}")
                print(f">>> SUCCESS: API Key in frontend/.env.local is VALID.")
            except:
                print(f"Response Format Error: {json.dumps(data, indent=2)}")
        else:
            print(f"Failed: {response.status_code}")
            print(f"Details: {response.text}")

    except Exception as e:
        print(f">>> CRITICAL: Connection failed: {e}")

print("---------------------------")
