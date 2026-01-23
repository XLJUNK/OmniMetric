import os
import google.generativeai as genai
from dotenv import load_dotenv

def test_key():
    print("--- Gemini API Key Verification ---")
    
    # 1. Load Env
    load_dotenv()
    key = os.getenv("GEMINI_API_KEY")
    
    if not key:
        print("❌ ERROR: GEMINI_API_KEY not found in environment variables.")
        return
        
    print(f"✅ Key found (Length: {len(key)})")
    print(f"🔑 Key prefix: {key[:4]}...")
    
    # 2. Configure SDK
    try:
        genai.configure(api_key=key)
        print("✅ SDK Configured")
    except Exception as e:
        print(f"❌ SDK Configuration Failed: {e}")
        return

    # 3. Test Generation
    print("🔄 Attempting simple generation with 'gemini-2.0-flash'...")
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Hello, reply with 'OK' if you can hear me.")
        
        if response.text:
            print(f"✅ Generation SUCCESS!")
            print(f"📝 Response: {response.text.strip()}")
            return True
        else:
            print("⚠️ Generation finished but returned empty text.")
    except Exception as e:
        print(f"❌ Generation FAILED: {e}")
        if "403" in str(e) or "API_KEY_INVALID" in str(e):
            print("   -> 🚨 CAUSE: The API Key is invalid or has expired.")
        elif "429" in str(e):
             print("   -> ⚠️ CAUSE: Rate Limit Exceeded.")
        elif "not found" in str(e).lower():
             print("   -> ⚠️ CAUSE: Model 'gemini-2.0-flash' not found. Trying 'gemini-pro'...")
             # Retry with fallback model
             try:
                model = genai.GenerativeModel('gemini-pro')
                response = model.generate_content("Status check.")
                print(f"✅ Generation SUCCESS (Fallback Model)!")
                return True
             except Exception as ex:
                print(f"❌ Fallback also failed: {ex}")

if __name__ == "__main__":
    test_key()
