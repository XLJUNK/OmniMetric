import os
import sys
import json

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from utils.file_ops import safe_json_merge

TEST_FILE = "test_data.json"

def test_missing_file():
    print(f"\n[TEST] Missing File: {TEST_FILE}")
    if os.path.exists(TEST_FILE):
        os.remove(TEST_FILE)
        
    new_data = {"status": "ok"}
    success = safe_json_merge(TEST_FILE, new_data)
    
    if success and os.path.exists(TEST_FILE):
        with open(TEST_FILE, 'r') as f:
            d = json.load(f)
        if d == new_data:
            print("PASS: Missing file created successfully.")
        else:
            print(f"FAIL: Content mismatch. {d} != {new_data}")
    else:
        print("FAIL: Function returned False or file not created.")

def test_corrupt_file():
    print(f"\n[TEST] Corrupt File: {TEST_FILE}")
    with open(TEST_FILE, 'w') as f:
        f.write("{ INVALID JSON ... ")
        
    new_data = {"status": "recovered"}
    success = safe_json_merge(TEST_FILE, new_data)
    
    if success:
        # Check main file
        with open(TEST_FILE, 'r') as f:
            d = json.load(f)
        
        # Check backup
        bak_file = TEST_FILE + ".bak"
        has_backup = os.path.exists(bak_file)
        
        if d == new_data and has_backup:
            print("PASS: Corrupt file handled, backup created.")
        else:
            print(f"FAIL: Data or backup missing. Backup: {has_backup}")
    else:
        print("FAIL: Function returned False on corrupt file.")

    # Cleanup
    if os.path.exists(TEST_FILE): os.remove(TEST_FILE)
    if os.path.exists(TEST_FILE + ".bak"): os.remove(TEST_FILE + ".bak")

if __name__ == "__main__":
    test_missing_file()
    test_corrupt_file()
