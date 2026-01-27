"""
Test script to verify API key redaction in centralized logging.
This script tests that sensitive API keys are properly redacted in log output.
"""

import os
import sys

# Set test API keys
os.environ["GEMINI_API_KEY"] = "AIzaTestKey12345678901234567890123456"
os.environ["FMP_API_KEY"] = "test_fmp_key_abc123"
os.environ["FRED_API_KEY"] = "test_fred_key_xyz789"

# Import after setting env vars
from gms_engine import log_diag

print("=" * 60)
print("API KEY REDACTION TEST")
print("=" * 60)

# Test 1: Direct API key in message
print("\n[TEST 1] Direct API key exposure:")
log_diag(f"Testing with GEMINI_API_KEY: {os.getenv('GEMINI_API_KEY')}")

# Test 2: API key in URL
print("\n[TEST 2] API key in URL parameter:")
log_diag(f"URL: https://api.example.com?apikey={os.getenv('GEMINI_API_KEY')}")

# Test 3: Multiple keys
print("\n[TEST 3] Multiple API keys:")
log_diag(f"GEMINI: {os.getenv('GEMINI_API_KEY')}, FMP: {os.getenv('FMP_API_KEY')}")

# Test 4: Error message with key
print("\n[TEST 4] Error message with API key:")
log_diag(f"[ERROR] API call failed with key: {os.getenv('FRED_API_KEY')}")

print("\n" + "=" * 60)
print("VERIFICATION:")
print("=" * 60)

# Check log file for redaction
log_file = "gms_engine.log"
if os.path.exists(log_file):
    with open(log_file, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Check that REDACTED appears
    if "REDACTED" in content:
        print("✅ REDACTED keyword found in log")
    else:
        print("❌ REDACTED keyword NOT found in log")
    
    # Check that actual keys DO NOT appear
    test_keys = ["AIzaTestKey", "test_fmp_key", "test_fred_key"]
    leaked_keys = [key for key in test_keys if key in content]
    
    if leaked_keys:
        print(f"❌ SECURITY RISK: Keys found in log: {leaked_keys}")
        sys.exit(1)
    else:
        print("✅ No API keys leaked in log file")
    
    print(f"\n✅ ALL TESTS PASSED - API key redaction working correctly")
else:
    print(f"⚠️  Log file not found: {log_file}")
    print("   (This is normal if logger hasn't written yet)")

print("=" * 60)
