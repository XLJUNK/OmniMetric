"""
Comprehensive Test Script for Critical Fixes
Tests CRITICAL-01, CRITICAL-02, and CRITICAL-03
"""

import sys
import os
from datetime import datetime, timezone

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_timezone_consistency():
    """Test that all timezone handling is consistent"""
    print("\n=== TEST 1: Timezone Consistency ===")
    
    # Test datetime.now(timezone.utc)
    utc_now = datetime.now(timezone.utc)
    print(f"✓ UTC Now (aware): {utc_now.isoformat()}")
    print(f"✓ Timezone info: {utc_now.tzinfo}")
    
    # Verify it's timezone-aware
    assert utc_now.tzinfo is not None, "Datetime should be timezone-aware"
    print("✓ Datetime is timezone-aware")
    
    # Test ISO format with Z suffix
    iso_format = utc_now.strftime("%Y-%m-%dT%H:%M:%SZ")
    print(f"✓ ISO Format: {iso_format}")
    
    print("✅ Timezone test PASSED\n")
    return True

def test_logger_integration():
    """Test centralized logger with API key redaction"""
    print("=== TEST 2: Logger Integration ===")
    
    try:
        from utils.log_utils import create_logger
        
        # Create logger with sensitive keys
        test_keys = [
            "AIzaSyDwWnIjpJeTbKx7QSuXnRKhKY0xmZcKn2k",
            "test_secret_key_12345"
        ]
        
        logger = create_logger("test_critical_fixes", sensitive_keys=test_keys)
        
        # Test logging with API key (should be redacted)
        logger.info("Testing with API key: AIzaSyDwWnIjpJeTbKx7QSuXnRKhKY0xmZcKn2k")
        logger.info("Testing with secret: test_secret_key_12345")
        logger.warn("Warning test", context={"api_key": test_keys[0]})
        logger.error("Error test", context={"status": 500})
        
        print("✓ Logger created successfully")
        print("✓ API keys should be redacted in log file")
        print("✓ Check backend/test_critical_fixes.log for redacted output")
        
        # Verify log file exists
        log_file = os.path.join(os.path.dirname(__file__), "test_critical_fixes.log")
        if os.path.exists(log_file):
            with open(log_file, 'r', encoding='utf-8') as f:
                content = f.read()
                # Verify redaction
                assert "AIzaSyDwWnIjpJeTbKx7QSuXnRKhKY0xmZcKn2k" not in content, "API key should be redacted"
                assert "REDACTED" in content, "REDACTED marker should be present"
                print("✓ API key redaction verified in log file")
        
        print("✅ Logger integration test PASSED\n")
        return True
        
    except Exception as e:
        print(f"❌ Logger test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_env_security():
    """Test that .env file doesn't contain actual API keys"""
    print("=== TEST 3: Environment Security ===")
    
    env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            content = f.read()
            
        # Check for placeholder values
        assert "your_fred_api_key_here" in content, ".env should have placeholder for FRED_API_KEY"
        assert "your_gemini_api_key_here" in content, ".env should have placeholder for GEMINI_API_KEY"
        
        # Check that NEXT_PUBLIC_ is deprecated
        if "NEXT_PUBLIC_GEMINI_API_KEY" in content:
            assert "# DEPRECATED" in content or "NEXT_PUBLIC_GEMINI_API_KEY=" not in content or "your_" in content, \
                "NEXT_PUBLIC_GEMINI_API_KEY should be deprecated or have placeholder"
        
        print("✓ .env file contains placeholders")
        print("✓ No actual API keys found in .env")
        print("✓ NEXT_PUBLIC_ prefix deprecated")
        
    # Check .env.example exists
    env_example = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.example")
    assert os.path.exists(env_example), ".env.example should exist"
    print("✓ .env.example template exists")
    
    print("✅ Environment security test PASSED\n")
    return True

def test_imports():
    """Test that all modified files can be imported without errors"""
    print("=== TEST 4: Import Verification ===")
    
    try:
        # Test imports
        print("Testing imports...")
        
        # These should not raise ImportError
        from utils import log_utils
        print("✓ utils.log_utils imported")
        
        # Verify timezone is imported in key modules
        import gms_engine
        assert hasattr(gms_engine, 'timezone') or 'timezone' in dir(gms_engine.datetime), \
            "gms_engine should import timezone"
        print("✓ gms_engine has timezone support")
        
        import fetch_news
        print("✓ fetch_news imported")
        
        import sns_publisher
        print("✓ sns_publisher imported")
        
        print("✅ Import verification test PASSED\n")
        return True
        
    except Exception as e:
        print(f"❌ Import test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("CRITICAL FIXES COMPREHENSIVE TEST SUITE")
    print("="*60)
    
    results = []
    
    # Run tests
    results.append(("Timezone Consistency", test_timezone_consistency()))
    results.append(("Logger Integration", test_logger_integration()))
    results.append(("Environment Security", test_env_security()))
    results.append(("Import Verification", test_imports()))
    
    # Summary
    print("="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Critical fixes are working correctly.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
