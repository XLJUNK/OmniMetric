
import os
import requests
import json
from dotenv import load_dotenv

# Load Env
print(f"CWD: {os.getcwd()}")
env_path = os.path.join(os.getcwd(), '.env')
if os.path.exists(env_path):
    print(f".env found at {env_path}")
    load_dotenv(env_path, override=True)
else:
    print(".env NOT found in CWD")

KEY = os.getenv("GEMINI_API_KEY")

print("--- GEMINI API KEY TEST ---")

if not KEY:
    print("CRITICAL: GEMINI_API_KEY is missing in local .env file.")
    # Fallback debug: print file content stats
    try:
        with open('.env', 'r') as f:
            print(f"File content length: {len(f.read())}")
    except: print("Cannot read .env")
else:
    print(f"API Key found: {KEY[:5]}...{KEY[-4:] if len(KEY)>5 else ''}")
    models = [("v1", "gemini-1.5-flash"), ("v1beta", "gemini-1.5-flash"), ("v1beta", "gemini-2.0-flash-exp")]
    
    for version, m in models:
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
                    print(f">>> SUCCESS: API Key is valid and working with {m}.")
                    break
                except:
                    print(f"Response Format Error: {json.dumps(data, indent=2)}")
            else:
                print(f"Model {m} Failed: {response.status_code}")
                # print(f"Details: {response.text}") # reduce noise

        except Exception as e:
            print(f">>> CRITICAL: Connection failed: {e}")

print("---------------------------")
