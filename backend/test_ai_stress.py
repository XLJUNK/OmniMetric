import subprocess
import os
import json
import time

def test_ai(i):
    print(f"Test {i}...")
    prompt = "Provide a very brief market summary for a test. Output JSON with key 'EN'."
    script_path = "dist/generate_insight.js"
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    
    process = subprocess.run(
        ["node", script_path, prompt],
        capture_output=True,
        text=True,
        encoding='utf-8',
        cwd=frontend_dir,
        env=os.environ.copy()
    )
    
    if process.returncode == 0:
        print(f"SUCCESS {i}")
        return True
    else:
        print(f"FAILURE {i}: {process.stderr}")
        return False

for i in range(1, 6):
    success = test_ai(i)
    if not success:
        break
    time.sleep(2) # Short pause
