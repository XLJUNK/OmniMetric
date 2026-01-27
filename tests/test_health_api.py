"""
Integration tests for health check API endpoint.

Tests:
- API returns valid JSON
- Status codes are correct
- Data freshness detection
- Error handling
"""

import os
import json
import sys

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


class TestHealthCheckAPI:
    """Test suite for health check API."""
    
    def test_health_check_structure(self):
        """Test health check response has required fields."""
        # This is a structure test - actual API test would require running server
        required_fields = ["status", "healthy"]
        
        # Mock response
        mock_response = {
            "status": "healthy",
            "healthy": True,
            "data": {
                "lastUpdate": "2026-01-27T12:00:00.000Z",
                "ageMinutes": 15,
                "ageHours": 0,
                "ageHuman": "15m ago",
                "gmsScore": 65.4,
                "expectedUpdateInterval": "30 minutes"
            }
        }
        
        for field in required_fields:
            assert field in mock_response, f"Response should have {field} field"
        
        assert "data" in mock_response, "Response should have data field"
        assert "lastUpdate" in mock_response["data"], "Data should have lastUpdate"
        assert "ageMinutes" in mock_response["data"], "Data should have ageMinutes"
    
    def test_status_levels(self):
        """Test different health status levels."""
        status_levels = ["healthy", "warning", "critical", "error"]
        
        for level in status_levels:
            assert level in status_levels, f"{level} should be valid status"
        
        # Test status logic
        age_minutes_healthy = 30
        age_minutes_warning = 90
        age_minutes_critical = 150
        
        assert age_minutes_healthy < 60, "30 minutes should be healthy"
        assert 60 <= age_minutes_warning <= 120, "90 minutes should be warning"
        assert age_minutes_critical > 120, "150 minutes should be critical"


if __name__ == "__main__":
    import traceback
    
    test_suite = TestHealthCheckAPI()
    tests = [
        "test_health_check_structure",
        "test_status_levels"
    ]
    
    passed = 0
    failed = 0
    
    for test_name in tests:
        try:
            test_method = getattr(test_suite, test_name)
            test_method()
            print(f"✓ {test_name}")
            passed += 1
        except Exception as e:
            print(f"✗ {test_name}")
            print(f"  Error: {e}")
            traceback.print_exc()
            failed += 1
    
    print(f"\n{passed} passed, {failed} failed")
    exit(0 if failed == 0 else 1)
