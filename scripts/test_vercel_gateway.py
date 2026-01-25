import os
import requests
import json
from dotenv import load_dotenv

def test_gateway():
    print("--- Vercel AI Gateway Unit Test ---")
    load_dotenv()
    
    # 1. Get Config
    key = os.getenv("GEMINI_API_KEY")
    slug = os.getenv("VERCEL_AI_GATEWAY_SLUG", "omni-metric")
    
    if not key:
        print("❌ ERROR: GEMINI_API_KEY is missing from environment.")
        print("   -> If running locally, check your .env file.")
        print("   -> If running in Cloud, check GitHub Secrets / Vercel Env Vars.")
        return

    print(f"🔹 Gateway Slug: {slug}")
    print(f"🔹 API Key: {key[:4]}... (Length: {len(key)})")

    # 2. Construct URL (Exact Production Pattern)
    # Pattern: https://gateway.ai.vercel.com/v1/{slug}/google/v1beta/models/{model}:generateContent
    model = "gemini-3-flash"
    base_url = f"https://gateway.ai.vercel.com/v1/{slug}/google/v1beta/models/{model}:generateContent"
    
    # Add Key as Query Param (Vercel Proxy Standard)
    target_url = f"{base_url}?key={key}"
    
    print(f"🔹 Target URL: {base_url} (Key Hidden)")
    
    # 3. Headers
    gateway_key = os.getenv("AI_GATEWAY_API_KEY")
    headers = {
        "Content-Type": "application/json",
        "x-vercel-ai-gateway-provider": "google",
        "x-vercel-ai-gateway-cache": "disable",
        "User-Agent": "OmniMetric-Verifier/1.0"
    }
    if gateway_key:
        headers["Authorization"] = f"Bearer {gateway_key}"
    
    # 4. Payload
    payload = {
        "contents": [{
            "parts": [{"text": "Reply with 'GATEWAY_OK' if you receive this."}]
        }]
    }

    # 5. Execute
    print("🚀 Sending Request...")
    try:
        response = requests.post(target_url, json=payload, headers=headers, timeout=15)
        
        print(f"📥 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ SUCCESS: Vercel AI Gateway is reachable and authorized.")
            data = response.json()
            try:
                text = data['candidates'][0]['content']['parts'][0]['text']
                print(f"📝 Response: {text.strip()}")
            except:
                print(f"⚠️ Response format unexpected: {data}")
        elif response.status_code == 401 or response.status_code == 403:
            print("❌ AUTH FAILURE: The API Key is rejected by Vercel or Google.")
            print(f"   Response: {response.text}")
        elif response.status_code == 404:
            print("❌ NOT FOUND: Check the Gateway Slug or Model Name.")
            print(f"   Response: {response.text}")
        else:
            print(f"❌ FAILURE: {response.text}")

    except Exception as e:
        print(f"❌ CONNECTION ERROR: {e}")

if __name__ == "__main__":
    test_gateway()
