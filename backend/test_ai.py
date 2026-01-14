import os
import requests
import json
import subprocess
from dotenv import load_dotenv

load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")

def test_rest_api():
    print("\n--- Testing Direct REST API (gemini-1.5-flash) ---")
    if not GEMINI_KEY:
        print("ERROR: GEMINI_API_KEY not found in environment.")
        return
    
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": "Say 'REST API SUCCESS' in JSON format: {'result': '...'}"}]}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=20)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

def test_node_bridge():
    print("\n--- Testing Node.js Bridge (generate_insight.ts) ---")
    script_path = "scripts/generate_insight.ts"
    # Adjust path if needed
    cwd = os.path.join(os.getcwd(), "frontend")
    prompt = "Say 'NODE BRIDGE SUCCESS' in JSON format: {'result': '...'}"
    
    try:
        # Clear guard file for testing
        guard_path = ".ai_guard"
        if os.path.exists(guard_path):
            os.remove(guard_path)
            
        process = subprocess.run(
            ["npx", "tsx", script_path, prompt],
            capture_output=True,
            text=True,
            cwd=cwd,
            env=os.environ.copy()
        )
        print(f"Return Code: {process.returncode}")
        print(f"STDOUT: {process.stdout}")
        print(f"STDERR: {process.stderr}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_node_bridge()
    test_rest_api()
