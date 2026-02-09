import os
import requests
import xml.etree.ElementTree as ET
import json
import time
import subprocess
import re
from datetime import datetime, timezone
from dateutil import parser
from dotenv import load_dotenv
import sys

# Force UTF-8 for Windows Console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Load environment
load_dotenv()
# GEMINI_KEY removed as it is not directly used here (used by bridge)

# LOGGING SETUP
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Centralized logging
from utils.log_utils import create_logger

# Initialize centralized logger
logger = create_logger(
    "fetch_news",
    sensitive_keys=[],  # News engine doesn't use API keys
    json_format=False
)
LOG_FILE = os.path.join(SCRIPT_DIR, "news_debug.log")

def log_diag(msg):
    """Wrapper for centralized logger (backward compatibility)."""
    # Add [NEWS_ENGINE] prefix for consistency
    prefixed_msg = f"[NEWS_ENGINE] {msg}"
    
    # Determine log level
    if "[ERROR]" in msg or "[FATAL]" in msg:
        logger.error(prefixed_msg)
    elif "[WARN]" in msg:
        logger.warn(prefixed_msg)
    else:
        logger.info(prefixed_msg)

def create_failure_flag(reason="Unknown"):
    """Creates a flag file to alert GitHub Actions but allow workflow to continue."""
    flag_path = os.path.join(os.path.dirname(__file__), "news_failed.flag") # Changed SCRIPT_DIR to os.path.dirname(__file__) and filename
    try:
        with open(flag_path, "w") as f:
            f.write(f"FAILURE REASON: {reason}\nTimestamp: {datetime.now(timezone.utc)}")
    except (IOError, OSError) as e: # Specific exception types
        log_diag(f"[WARN] Failed to create failure flag: {e}")

def fetch_raw_news():
    """Fetches top 6 headlines from CNBC RSS."""
    FEED_URL = f'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114&t={int(time.time())}'
    try:
        log_diag(f"Fetching RSS from {FEED_URL}...")
        res = requests.get(FEED_URL, timeout=15)
        res.raise_for_status()  # Raise HTTPError for bad status codes
        
        root = ET.fromstring(res.text)
        items = []
        for item in root.findall('.//item')[:6]:
            title_node = item.find('title')
            link_node = item.find('link')
            pub_date_node = item.find('pubDate')
            
            if title_node is None or link_node is None:
                continue

            title = title_node.text or ""
            link = link_node.text or ""
            pub_date = pub_date_node.text if pub_date_node is not None else ""
            
            # Basic cleanup
            title = title.replace('<![CDATA[', '').replace(']]>', '').strip()
            
            # Date Handling
            iso_date = datetime.now(timezone.utc).isoformat() + "Z"
            if pub_date:
                try:
                    # Use dateutil.parser for robust date parsing
                    parsed_date = parser.parse(pub_date)
                    iso_date = parsed_date.isoformat() + "Z"
                except (ValueError, parser.ParserError) as e:
                    log_diag(f"[WARN] Date parsing failed for '{pub_date}': {e}")
                    iso_date = datetime.now(timezone.utc).isoformat() + "Z" # Fallback to current UTC time

            items.append({
                "title": title,
                "link": link,
                "isoDate": iso_date
            })
        
        count = len(items)
        log_diag(f"RSS Parsed: {count} items found.")
        return items
    except requests.exceptions.Timeout:
        log_diag(f"[RSS_TIMEOUT] CNBC RSS feed timed out after 15s")
        return []
    except requests.exceptions.ConnectionError as e:
        log_diag(f"[RSS_CONNECTION] Network error: {e}")
        return []
    except requests.exceptions.HTTPError as e:
        log_diag(f"[RSS_HTTP] HTTP {e.response.status_code}: {e}")
        return []
    except ET.ParseError as e:
        log_diag(f"[RSS_PARSE] XML parsing error: {e}")
        return []
    except Exception as e:
        log_diag(f"[RSS_UNEXPECTED] {type(e).__name__}: {e}")
        return []

def translate_news_batch(items):
    """Invokes Node.js bridge with STRICT absolute paths."""
    if not items:
        return {}

    titles = [item['title'] for item in items]
    prompt = f"""You are a professional financial translator.
Translate these {len(titles)} headlines into JP, CN, ES, HI, ID, AR, DE, FR.
Input: {json.dumps(titles)}
Output JSON format: {{ "JP": [...], "CN": [...], ... }} only."""

    try:
        log_diag("Preparing Node.js Bridge...")
        
        # 1. ABSOLUTE PATH CALCULATION
        # backend/fetch_news.py -> backend/ -> root/ -> frontend/
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        root_dir = os.path.dirname(backend_dir)
        frontend_dir = os.path.join(root_dir, "frontend")
        script_path = os.path.join(frontend_dir, "scripts", "generate_insight.ts")
        
        log_diag(f"Resolving paths:")
        log_diag(f"  Root: {root_dir}")
        log_diag(f"  Frontend: {frontend_dir}")
        log_diag(f"  Script: {script_path}")
        
        if not os.path.exists(script_path):
            log_diag(f"[FATAL] Translation Script NOT FOUND at {script_path}")
            create_failure_flag("Translation Script Missing")
            return {} 

        # 2. COMMAND CONSTRUCTION
        # Linux/Actions: ["npx", "tsx", path] with shell=False
        # Windows: shell=True required for npx
        cmd = ["npx", "tsx", script_path]
        use_shell = (sys.platform == 'win32')
        
        log_diag(f"Executing: {cmd} (shell={use_shell}, cwd={frontend_dir})")

        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            shell=use_shell,
            cwd=frontend_dir 
        )
        
        stdout, stderr = process.communicate(input=prompt, timeout=120)
        
        if process.returncode != 0:
            log_diag(f"[FATAL] Node process exited with code {process.returncode}")
            log_diag(f"[STDERR] {stderr[:500]}")
            log_diag(f"[STDOUT] {stdout[:500]}")
            create_failure_flag(f"Node Process Failed (Code {process.returncode})")
            return {}

        # 3. RESPONSE PARSING
        log_diag(f"Node finished. Stdout length: {len(stdout)} chars")
        
        # Regex to find JSON envelope from generate_insight.ts
        match = re.search(r'\{"text":.*\}', stdout, re.DOTALL)
        if not match:
            log_diag(f"[FATAL] Invalid Bridge Output (No JSON wrapper). Raw: {stdout[:500]}")
            create_failure_flag("Invalid Bridge Output")
            return {}

        wrapper = json.loads(match.group(0))
        inner_text = wrapper.get("text", "")
        
        # Extract inner JSON if wrapped in markdown
        json_match = re.search(r'(\{.*\})', inner_text, re.DOTALL)
        if not json_match:
             try:
                 data = json.loads(inner_text)
                 return data
             except json.JSONDecodeError: # Specific exception type
                 log_diag(f"[FATAL] Could not parse AI response JSON: {inner_text[:200]}")
                 create_failure_flag("JSON Parse Error")
                 return {}

        final_json_str = json_match.group(1)
        data = json.loads(final_json_str)
        
        required = ["JP", "CN", "ES", "HI", "ID", "AR", "DE", "FR"]
        if not all(k in data for k in required):
            log_diag(f"[FATAL] Missing languages in translation. Got: {list(data.keys())}")
            create_failure_flag("Missing Languages")
            return {}
            
        log_diag("[SUCCESS] Translation verified.")
        return data

    except Exception as e:
        log_diag(f"[FATAL] Bridge Exception: {e}")
        create_failure_flag(f"Bridge Exception: {e}")
        return None

def get_news_payload():
    """Logic split to allow gms_engine to call news fetch directly."""
    items = fetch_raw_news()
    if not items: return None
    translations = translate_news_batch(items)
    if not translations: return None
    return {
        "news": items,
        "translations": translations,
        "last_updated": datetime.now(timezone.utc).isoformat() + "Z"
    }

def main():
    log_diag("=== STARTING NEWS UPDATE ===")
    
    # 1. Fetch
    news_items = fetch_raw_news()
    if not news_items:
        log_diag("[FATAL] No news items fetched.")
        create_failure_flag("No News Items Fetched")
        sys.exit(0) # Fail-Open (Allow partial commit)

    # 2. Translate
    translations = translate_news_batch(news_items)
    if not translations:
        log_diag("[FATAL] Translation returned empty.")
        create_failure_flag("Translation Empty")
        sys.exit(0)

    # 3. Update File
    payload = {
        "news": news_items,
        "translations": translations,
        "last_updated": datetime.now(timezone.utc).isoformat()
    }
    
    signal_path = os.path.join(SCRIPT_DIR, "current_signal.json")
    
    try:
        # Read existing to preserve other keys
        if os.path.exists(signal_path):
            with open(signal_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = {}
            
        data["intelligence"] = payload
        
        with open(signal_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            
        log_diag(f"[SUCCESS] current_signal.json updated at {signal_path}")
        
    except Exception as e:
        log_diag(f"[FATAL] File Write Error: {e}")
        create_failure_flag(f"File Write Error: {e}")
        sys.exit(0)

if __name__ == "__main__":
    main()
