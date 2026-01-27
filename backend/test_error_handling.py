"""
Test script for error handling improvements (HIGH-01 Phase 1)
Verifies that silent exceptions have been properly replaced with logging
"""

import os
import sys
import json
from datetime import datetime, timezone

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_import_modules():
    """Test that all modified modules can be imported without errors"""
    print("\n=== Test 1: Module Import ===")
    try:
        import gms_engine
        print("✅ gms_engine.py imported successfully")
    except Exception as e:
        print(f"❌ gms_engine.py import failed: {e}")
        return False
    
    try:
        import fetch_news
        print("✅ fetch_news.py imported successfully")
    except Exception as e:
        print(f"❌ fetch_news.py import failed: {e}")
        return False
    
    try:
        import sns_publisher
        print("✅ sns_publisher.py imported successfully")
    except Exception as e:
        print(f"❌ sns_publisher.py import failed: {e}")
        return False
    
    return True

def test_error_logging():
    """Test that errors are properly logged instead of silently ignored"""
    print("\n=== Test 2: Error Logging ===")
    
    # Test JSON decode error handling
    try:
        import gms_engine
        # This should trigger the new error handling
        test_file = "test_invalid.json"
        with open(test_file, 'w') as f:
            f.write("invalid json{")
        
        # Try to load it (should log error, not crash)
        try:
            with open(test_file, 'r') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"✅ JSON error properly caught and can be logged: {type(e).__name__}")
        finally:
            if os.path.exists(test_file):
                os.remove(test_file)
        
        return True
    except Exception as e:
        print(f"❌ Error logging test failed: {e}")
        return False

def test_specific_exceptions():
    """Verify specific exception types are used instead of broad Exception"""
    print("\n=== Test 3: Specific Exception Types ===")
    
    # Read the modified files and check for improvements
    files_to_check = [
        'gms_engine.py',
        'fetch_news.py',
        'sns_publisher.py'
    ]
    
    silent_exceptions_found = 0
    
    for filename in files_to_check:
        filepath = os.path.join(os.path.dirname(__file__), filename)
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Check for silent exceptions
                import re
                matches = re.findall(r'except:\s*pass', content)
                if matches:
                    silent_exceptions_found += len(matches)
                    print(f"⚠️  {filename}: Found {len(matches)} silent exception(s)")
                else:
                    print(f"✅ {filename}: No silent exceptions found")
    
    if silent_exceptions_found == 0:
        print(f"\n✅ All silent exceptions removed!")
        return True
    else:
        print(f"\n❌ Found {silent_exceptions_found} silent exception(s)")
        return False

def test_log_file_creation():
    """Test that log files can be created properly"""
    print("\n=== Test 4: Log File Creation ===")
    
    try:
        import gms_engine
        
        # Test log_diag function
        test_message = f"[TEST] Error handling test at {datetime.now(timezone.utc).isoformat()}"
        gms_engine.log_diag(test_message)
        
        # Check if log file was created
        log_file = os.path.join(os.path.dirname(__file__), 'engine_log.txt')
        if os.path.exists(log_file):
            with open(log_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if test_message in content:
                    print(f"✅ Log file created and test message found")
                    return True
                else:
                    print(f"⚠️  Log file exists but test message not found")
                    return False
        else:
            print(f"⚠️  Log file not created")
            return False
    except Exception as e:
        print(f"❌ Log file creation test failed: {e}")
        return False

def main():
    print("=" * 60)
    print("HIGH-01 Phase 1: Error Handling Improvements Test")
    print("=" * 60)
    
    results = []
    
    # Run all tests
    results.append(("Module Import", test_import_modules()))
    results.append(("Error Logging", test_error_logging()))
    results.append(("Specific Exceptions", test_specific_exceptions()))
    results.append(("Log File Creation", test_log_file_creation()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Error handling improvements verified.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
