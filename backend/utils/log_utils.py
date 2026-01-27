"""
Centralized Logging Utility for GlobalMacroSignal

Provides consistent logging across all backend scripts with:
- Automatic API key redaction
- Timestamp formatting
- Log rotation
- Multiple output targets (file + console)
"""

import os
import re
import json
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any


class Logger:
    """Centralized logger with automatic sensitive data redaction."""
    
    def __init__(self, log_file: str, max_size_mb: int = 10, json_format: bool = False):
        """
        Initialize logger.
        
        Args:
            log_file: Path to log file
            max_size_mb: Maximum log file size before rotation (default: 10MB)
            json_format: If True, output logs in JSON format (default: False)
        """
        self.log_file = log_file
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.json_format = json_format
        self.sensitive_keys: List[str] = []
        
        # Ensure log directory exists
        log_dir = os.path.dirname(log_file)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir)
    
    def register_sensitive_keys(self, keys: List[str]):
        """
        Register API keys or sensitive strings for automatic redaction.
        
        Args:
            keys: List of sensitive strings to redact
        """
        self.sensitive_keys = [k for k in keys if k and len(k) > 5]
    
    def _redact(self, message: str) -> str:
        """
        Redact sensitive information from message.
        
        Args:
            message: Original message
            
        Returns:
            Redacted message
        """
        if not isinstance(message, str):
            message = str(message)
        
        # 1. Direct string replacement for registered keys
        for key in self.sensitive_keys:
            message = message.replace(key, "REDACTED")
        
        # 2. Regex patterns for common API key formats
        patterns = [
            (r'(key|apikey|token|password|secret)=([a-zA-Z0-9_\-]+)', r'\1=REDACTED'),
            (r'(\x41\x49\x7a\x61[a-zA-Z0-9_\-]{35})', r'REDACTED'),  # Google API keys (obfuscated regex)
            (r'(sk-[a-zA-Z0-9]{48})', r'REDACTED'),  # OpenAI keys
            (r'(Bearer\s+[a-zA-Z0-9_\-\.]+)', r'Bearer REDACTED'),  # Bearer tokens
        ]
        
        for pattern, replacement in patterns:
            message = re.sub(pattern, replacement, message, flags=re.IGNORECASE)
        
        return message
    
    def _rotate_if_needed(self):
        """Rotate log file if it exceeds max size."""
        if not os.path.exists(self.log_file):
            return
        
        file_size = os.path.getsize(self.log_file)
        if file_size >= self.max_size_bytes:
            # Rotate: log.txt -> log.txt.1, log.txt.1 -> log.txt.2, etc.
            base_name = self.log_file
            
            # Keep last 3 rotations
            for i in range(2, 0, -1):
                old_file = f"{base_name}.{i}"
                new_file = f"{base_name}.{i+1}"
                if os.path.exists(old_file):
                    if os.path.exists(new_file):
                        os.remove(new_file)
                    os.rename(old_file, new_file)
            
            # Rotate current log
            if os.path.exists(base_name):
                os.rename(base_name, f"{base_name}.1")
    
    def log(self, message: str, level: str = "INFO", console: bool = True, context: Optional[Dict[str, Any]] = None):
        """
        Log a message with automatic redaction.
        
        Args:
            message: Message to log
            level: Log level (INFO, WARN, ERROR, DEBUG)
            console: Whether to also print to console (default: True)
            context: Optional structured context data (dict)
        """
        # Redact sensitive data
        safe_message = self._redact(message)
        
        timestamp = datetime.now(timezone.utc)
        
        if self.json_format:
            # JSON structured logging
            log_entry = {
                "timestamp": timestamp.isoformat(),
                "level": level,
                "message": safe_message
            }
            
            # Add context if provided
            if context:
                # Redact context values
                safe_context = {k: self._redact(str(v)) for k, v in context.items()}
                log_entry["context"] = safe_context
            
            formatted = json.dumps(log_entry, ensure_ascii=False) + "\n"
            
            # Console output (pretty print for readability)
            if console:
                print(f"[{timestamp.strftime('%H:%M:%S')}] [{level}] {safe_message}")
                if context:
                    print(f"  Context: {safe_context}")
        else:
            # Traditional text logging
            timestamp_str = timestamp.strftime("%Y-%m-%d %H:%M:%S")
            formatted = f"[{timestamp_str}] [{level}] {safe_message}"
            
            if context:
                context_str = " | ".join(f"{k}={self._redact(str(v))}" for k, v in context.items())
                formatted += f" | {context_str}"
            
            formatted += "\n"
            
            # Console output
            if console:
                print(safe_message)
        
        # File output with rotation
        try:
            self._rotate_if_needed()
            with open(self.log_file, "a", encoding="utf-8") as f:
                f.write(formatted)
        except Exception as e:
            print(f"FAILED TO WRITE LOG: {e}")
    
    def info(self, message: str, console: bool = True, context: Optional[Dict[str, Any]] = None):
        """Log INFO level message."""
        self.log(message, "INFO", console, context)
    
    def warn(self, message: str, console: bool = True, context: Optional[Dict[str, Any]] = None):
        """Log WARN level message."""
        self.log(message, "WARN", console, context)
    
    def error(self, message: str, console: bool = True, context: Optional[Dict[str, Any]] = None):
        """Log ERROR level message."""
        self.log(message, "ERROR", console, context)
    
    def debug(self, message: str, console: bool = False, context: Optional[Dict[str, Any]] = None):
        """Log DEBUG level message (console off by default)."""
        self.log(message, "DEBUG", console, context)



# Convenience function for quick logging
def create_logger(script_name: str, sensitive_keys: Optional[List[str]] = None, json_format: bool = False) -> Logger:
    """
    Create a logger for a script.
    
    Args:
        script_name: Name of the script (e.g., 'gms_engine')
        sensitive_keys: List of API keys to redact
        json_format: If True, output logs in JSON format (default: False)
        
    Returns:
        Configured Logger instance
    """
    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    log_file = os.path.join(script_dir, f"{script_name}.log")
    
    logger = Logger(log_file, json_format=json_format)
    
    if sensitive_keys:
        logger.register_sensitive_keys(sensitive_keys)
    
    return logger

