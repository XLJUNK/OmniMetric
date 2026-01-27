"""
Unit tests for centralized logging utility.

Tests:
- Logger initialization
- API key redaction
- Log rotation
- JSON format output
- Context fields
"""

import os
import json
import tempfile
import shutil
from pathlib import Path

# Add parent directory to path for imports
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.utils.log_utils import Logger, create_logger


class TestLogger:
    """Test suite for Logger class."""
    
    def setup_method(self):
        """Create temporary directory for test logs."""
        self.test_dir = tempfile.mkdtemp()
        self.log_file = os.path.join(self.test_dir, "test.log")
    
    def teardown_method(self):
        """Clean up temporary directory."""
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)
    
    def test_logger_initialization(self):
        """Test logger creates log file and directory."""
        logger = Logger(self.log_file)
        logger.info("Test message")
        
        assert os.path.exists(self.log_file), "Log file should be created"
        
        with open(self.log_file, 'r') as f:
            content = f.read()
            assert "Test message" in content, "Message should be in log file"
            assert "[INFO]" in content, "Log level should be in log file"
    
    def test_api_key_redaction(self):
        """Test sensitive API keys are redacted."""
        logger = Logger(self.log_file)
        logger.register_sensitive_keys(["secret_key_12345", "DUMMY_GOOGLE_KEY_123"])
        
        logger.info("Using API key: secret_key_12345")
        logger.info("Google key: DUMMY_GOOGLE_KEY_123")
        
        with open(self.log_file, 'r') as f:
            content = f.read()
            assert "secret_key_12345" not in content, "API key should be redacted"
            assert "DUMMY_GOOGLE_KEY_123" not in content, "Google key should be redacted"
            assert "REDACTED" in content, "REDACTED placeholder should be present"
    
    def test_log_rotation(self):
        """Test log file rotates when size limit is reached."""
        # Create logger with very small max size (1KB)
        logger = Logger(self.log_file, max_size_mb=0.001)
        
        # Write enough data to trigger rotation
        for i in range(100):
            logger.info(f"Test message {i} with some padding to increase size")
        
        # Check that rotation occurred
        assert os.path.exists(f"{self.log_file}.1"), "Rotated log file should exist"
    
    def test_json_format(self):
        """Test JSON format output."""
        json_log_file = os.path.join(self.test_dir, "test_json.log")
        logger = Logger(json_log_file, json_format=True)
        
        logger.info("JSON test message", context={"user": "test", "action": "login"})
        
        with open(json_log_file, 'r') as f:
            line = f.readline()
            log_entry = json.loads(line)
            
            assert log_entry["level"] == "INFO", "Level should be INFO"
            assert log_entry["message"] == "JSON test message", "Message should match"
            assert "timestamp" in log_entry, "Timestamp should be present"
            assert log_entry["context"]["user"] == "test", "Context should be preserved"
            assert log_entry["context"]["action"] == "login", "Context should be preserved"
    
    def test_context_redaction(self):
        """Test context values are redacted."""
        json_log_file = os.path.join(self.test_dir, "test_context.log")
        logger = Logger(json_log_file, json_format=True)
        logger.register_sensitive_keys(["secret123"])
        
        logger.info("Test", context={"api_key": "secret123", "user": "john"})
        
        with open(json_log_file, 'r') as f:
            line = f.readline()
            log_entry = json.loads(line)
            
            assert "secret123" not in str(log_entry), "Secret should be redacted in context"
            assert "REDACTED" in log_entry["context"]["api_key"], "Context should contain REDACTED"
    
    def test_log_levels(self):
        """Test different log levels."""
        logger = Logger(self.log_file)
        
        logger.info("Info message")
        logger.warn("Warning message")
        logger.error("Error message")
        logger.debug("Debug message")
        
        with open(self.log_file, 'r') as f:
            content = f.read()
            assert "[INFO]" in content, "INFO level should be present"
            assert "[WARN]" in content, "WARN level should be present"
            assert "[ERROR]" in content, "ERROR level should be present"
            assert "[DEBUG]" in content, "DEBUG level should be present"
    
    def test_create_logger_helper(self):
        """Test create_logger convenience function."""
        logger = create_logger("test_script", sensitive_keys=["key123"])
        
        # Logger should be created
        assert logger is not None, "Logger should be created"
        assert len(logger.sensitive_keys) > 0, "Sensitive keys should be registered"


if __name__ == "__main__":
    # Simple test runner
    import traceback
    
    test_suite = TestLogger()
    tests = [
        "test_logger_initialization",
        "test_api_key_redaction",
        "test_log_rotation",
        "test_json_format",
        "test_context_redaction",
        "test_log_levels",
        "test_create_logger_helper"
    ]
    
    passed = 0
    failed = 0
    
    for test_name in tests:
        try:
            test_suite.setup_method()
            test_method = getattr(test_suite, test_name)
            test_method()
            test_suite.teardown_method()
            print(f"✓ {test_name}")
            passed += 1
        except Exception as e:
            print(f"✗ {test_name}")
            print(f"  Error: {e}")
            traceback.print_exc()
            failed += 1
    
    print(f"\n{passed} passed, {failed} failed")
    exit(0 if failed == 0 else 1)
