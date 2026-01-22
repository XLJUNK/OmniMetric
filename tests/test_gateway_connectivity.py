import os
import requests
import json
import ssl
import certifi
import urllib3
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.ssl_ import create_urllib3_context
from dotenv import load_dotenv

# Load env variables
load_dotenv()
backend_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', '.env')
if os.path.exists(backend_env):
    load_dotenv(backend_env)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GATEWAY_SLUG = os.getenv("VERCEL_AI_GATEWAY_SLUG", "omni-metric")
MODEL = "gemini-2.0-flash-001"

# === CUSTOM SSL ADAPTER FOR TLS 1.2+ ===
class TLSAdapter(HTTPAdapter):
    def init_poolmanager(self, connections, maxsize, block=False, **pool_kwargs):
        """Create a PoolManager that enforces TLS 1.2 or higher."""
        ctx = create_urllib3_context()
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
        ctx.set_ciphers('DEFAULT@SECLEVEL=1') # Lower security level for compatibility if needed
        pool_kwargs['ssl_context'] = ctx
        return super(TLSAdapter, self).init_poolmanager(connections, maxsize, block=block, **pool_kwargs)

def test_connectivity():
    print(f"--- [TEST] Vercel AI Gateway Connection Probe ({MODEL}) ---")
    
    if not GEMINI_API_KEY:
        print("[FAIL] GEMINI_API_KEY not found in environment.")
        return

    url = f"https://gateway.ai.vercel.com/v1/{GATEWAY_SLUG}/google/models/{MODEL}:generateContent"
    
    headers = {
        "Content-Type": "application/json",
        "x-vercel-ai-gateway-provider": "google",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Authorization": f"Bearer {GEMINI_API_KEY}" 
    }
    
    payload = {
        "contents": [{
            "parts": [{"text": "Hello, this is a secure connectivity test."}]
        }]
    }
    
    print(f"Target: {url}")
    print(f"Certifi Path: {certifi.where()}")
    
    # Session with Custom SSL
    session = requests.Session()
    adapter = TLSAdapter()
    session.mount("https://", adapter)
    
    # === CONTROL TEST ===
    print("\n--- CONTROL TEST: https://www.google.com ---")
    try:
        r = requests.get("https://www.google.com", timeout=5)
        print(f"Control Status: {r.status_code} (Internet is reachable)")
    except Exception as e:
        print(f"Control Failed: {e} (System-wide Network/SSL Issue)")

    try:
        print("\n--- ATTEMPT 1: Strict TLS 1.2+ & Certifi Verification ---")
        response = session.post(url, headers=headers, json=payload, timeout=20, verify=certifi.where())
        
        print(f"HTTP Status: {response.status_code}")
        if response.status_code == 200:
             print("[SUCCESS] Connected securely via Custom TLS Adapter.")
             print(f"Response: {str(response.json())[:100]}...")
        else:
             print(f"[FAIL] Server responded with error: {response.status_code}\n{response.text}")
             
    except Exception as e:
        print(f"[EXCEPTION] Secure Handshake Failed: {e}")
        
        # Fallback Diagnostic: WEAK CIPHERS
        print("\n--- ATTEMPT 2: WEAK CIPHERS (SECLEVEL=0) ---")
        try:
             ctx = create_urllib3_context()
             ctx.set_ciphers('DEFAULT@SECLEVEL=0')
             ctx.check_hostname = False # CRITICAL FIX
             # Force TLS 1.0+ (Allow old)
             ctx.minimum_version = ssl.TLSVersion.TLSv1
             
             class WeakAdapter(HTTPAdapter):
                 def init_poolmanager(self, *args, **kwargs):
                     kwargs['ssl_context'] = ctx
                     return super(WeakAdapter, self).init_poolmanager(*args, **kwargs)
            
             weak_session = requests.Session()
             weak_session.mount("https://", WeakAdapter())
             
             response = weak_session.post(url, headers=headers, json=payload, timeout=20, verify=False)
             print(f"HTTP Status (Weak/Unverified): {response.status_code}")
             if response.status_code == 200:
                 print("[SUCCESS] Connected using WEAK security parameters.")
             else:
                 print(f"[FAIL] Weak request failed: {response.status_code}")
        except Exception as e2:
            print(f"[CRITICAL] Weak Cipher Attempt Failed: {e2}")


if __name__ == "__main__":
    test_connectivity()
