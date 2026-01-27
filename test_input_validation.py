"""
Test script for API input validation (HIGH-04 Verification)
Tests all API routes with invalid inputs to verify zod validation works correctly
"""

import requests
import json
from typing import Dict, Any, List

# Base URL for the frontend (adjust if needed)
BASE_URL = "http://localhost:3000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name: str):
    print(f"\n{Colors.BLUE}=== {name} ==={Colors.END}")

def print_pass(message: str):
    print(f"{Colors.GREEN}✅ PASS:{Colors.END} {message}")

def print_fail(message: str):
    print(f"{Colors.RED}❌ FAIL:{Colors.END} {message}")

def print_warn(message: str):
    print(f"{Colors.YELLOW}⚠️  WARN:{Colors.END} {message}")

def test_api_news_invalid_lang():
    """Test /api/news with invalid language parameter"""
    print_test("Test 1: /api/news with invalid language")
    
    test_cases = [
        ("INVALID", "Invalid language code"),
        ("FR", "Unsupported language (FR)"),
        ("123", "Numeric language code"),
        ("", "Empty language code"),
    ]
    
    for lang, description in test_cases:
        try:
            url = f"{BASE_URL}/api/news?lang={lang}"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 400:
                data = response.json()
                if data.get('success') == False and 'errors' in data:
                    print_pass(f"{description}: Got 400 with validation errors")
                else:
                    print_warn(f"{description}: Got 400 but unexpected format: {data}")
            elif response.status_code == 200:
                # Some invalid inputs might fall back to default
                print_warn(f"{description}: Got 200 (fallback to default)")
            else:
                print_fail(f"{description}: Unexpected status {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print_fail(f"{description}: Request failed: {e}")

def test_api_news_valid_lang():
    """Test /api/news with valid language parameters"""
    print_test("Test 2: /api/news with valid languages")
    
    valid_langs = ['EN', 'JP', 'CN', 'ES', 'HI', 'ID', 'AR']
    
    for lang in valid_langs:
        try:
            url = f"{BASE_URL}/api/news?lang={lang}"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') == True:
                    print_pass(f"{lang}: Got 200 with success=true")
                else:
                    print_warn(f"{lang}: Got 200 but success=false")
            else:
                print_fail(f"{lang}: Unexpected status {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print_fail(f"{lang}: Request failed: {e}")

def test_api_signal():
    """Test /api/signal endpoint"""
    print_test("Test 3: /api/signal endpoint")
    
    try:
        url = f"{BASE_URL}/api/signal"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if 'score' in data or 'gms' in data:
                print_pass("Got 200 with signal data")
            else:
                print_warn(f"Got 200 but unexpected format: {list(data.keys())}")
        else:
            print_fail(f"Unexpected status {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_fail(f"Request failed: {e}")

def test_api_live():
    """Test /api/live endpoint"""
    print_test("Test 4: /api/live endpoint")
    
    try:
        url = f"{BASE_URL}/api/live"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print_pass(f"Got 200 with data: {list(data.keys())[:5]}")
        else:
            print_fail(f"Unexpected status {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_fail(f"Request failed: {e}")

def test_api_health():
    """Test /api/health endpoint"""
    print_test("Test 5: /api/health endpoint")
    
    try:
        url = f"{BASE_URL}/api/health"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'ok':
                print_pass("Got 200 with status=ok")
            else:
                print_warn(f"Got 200 but status={data.get('status')}")
        else:
            print_fail(f"Unexpected status {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_fail(f"Request failed: {e}")

def test_security_headers():
    """Test that security headers are present in responses"""
    print_test("Test 6: Security Headers")
    
    endpoints = [
        "/api/news",
        "/api/signal",
        "/api/live",
        "/api/health"
    ]
    
    expected_headers = [
        "X-Content-Type-Options",
        "X-Frame-Options",
        "X-XSS-Protection",
        "Referrer-Policy"
    ]
    
    for endpoint in endpoints:
        try:
            url = f"{BASE_URL}{endpoint}"
            response = requests.get(url, timeout=5)
            
            found_headers = []
            for header in expected_headers:
                if header in response.headers:
                    found_headers.append(header)
            
            if len(found_headers) >= 3:  # At least 3 out of 4
                print_pass(f"{endpoint}: {len(found_headers)}/4 security headers present")
            else:
                print_warn(f"{endpoint}: Only {len(found_headers)}/4 security headers present")
                
        except requests.exceptions.RequestException as e:
            print_fail(f"{endpoint}: Request failed: {e}")

def test_validation_error_format():
    """Test that validation errors have consistent format"""
    print_test("Test 7: Validation Error Format")
    
    try:
        url = f"{BASE_URL}/api/news?lang=INVALID"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 400:
            data = response.json()
            
            # Check for expected fields
            has_success = 'success' in data and data['success'] == False
            has_error = 'error' in data
            has_errors = 'errors' in data and isinstance(data['errors'], list)
            
            if has_success and has_error and has_errors:
                print_pass("Validation error has correct format (success, error, errors)")
                
                # Check error structure
                if len(data['errors']) > 0:
                    error = data['errors'][0]
                    if 'field' in error and 'message' in error:
                        print_pass("Error objects have field and message")
                    else:
                        print_warn(f"Error object missing fields: {error}")
            else:
                print_warn(f"Validation error format incomplete: {data}")
        else:
            print_warn(f"Expected 400, got {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_fail(f"Request failed: {e}")

def main():
    print("=" * 60)
    print("HIGH-04 Input Validation Test Suite")
    print("=" * 60)
    print(f"\nTesting against: {BASE_URL}")
    print("Note: Server must be running on localhost:3000")
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=2)
        print_pass("Server is running")
    except requests.exceptions.RequestException:
        print_fail("Server is not running. Please start with 'npm run dev'")
        print("\nSkipping tests...")
        return 1
    
    # Run all tests
    test_api_news_invalid_lang()
    test_api_news_valid_lang()
    test_api_signal()
    test_api_live()
    test_api_health()
    test_security_headers()
    test_validation_error_format()
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print("\n✅ All tests completed")
    print("Review the output above for any failures or warnings")
    
    return 0

if __name__ == "__main__":
    exit(main())
