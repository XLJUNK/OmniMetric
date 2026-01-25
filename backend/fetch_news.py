import os
import requests
import xml.etree.ElementTree as ET
import json
import time
import subprocess
import re
from datetime import datetime
from dotenv import load_dotenv
import sys

# Force UTF-8 for Windows Console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Load environment
load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# LOGGING SETUP
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(SCRIPT_DIR, "news_debug.log")

def log_diag(msg):
    """Robust logger that writes to both console and file with timestamp."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_msg = f"[{timestamp}] [NEWS_ENGINE] {msg}"
    
    # Console
    try:
        print(formatted_msg)
    except:
        pass

    # File
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(formatted_msg + "\n")
    except:
        pass

def create_failure_flag(reason="Unknown"):
    """Creates a flag file to alert GitHub Actions but allow workflow to continue."""
    flag_path = os.path.join(SCRIPT_DIR, "ai_failed.flag")
    try:
        with open(flag_path, "w") as f:
            f.write(f"FAILURE REASON: {reason}\\nTimestamp: {datetime.now()}")
    except: pass

def fetch_raw_news():
    """Fetches top 6 headlines from CNBC RSS."""
    FEED_URL = f'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114&t={int(time.time())}'
    try:
        log_diag(f"Fetching RSS from {FEED_URL}...")
        res = requests.get(FEED_URL, timeout=15)
        if res.status_code != 200:
            log_diag(f"[ERROR] RSS Fetch Failed: Status {res.status_code}")
            return []
        
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
            iso_date = datetime.utcnow().isoformat() + "Z"
            if pub_date:
                try:
                    # Simplistic approach to handle CNBC date formats
                    clean_date = pub_date.split(' +')[0].split(' -')[0].replace(" EST", "").replace(" EDT", "").strip()
                    for fmt in ["%a, %d %b %Y %H:%M:%S", "%d %b %Y %H:%M:%S"]:
                        try:
                            dt = datetime.strptime(clean_date, fmt)
                            iso_date = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
                            break
                        except: continue
                except: pass

            items.append({
                "title": title,
                "link": link,
                "isoDate": iso_date
            })
        
        count = len(items)
        log_diag(f"RSS Parsed: {count} items found.")
        return items
    except Exception as e:
        log_diag(f"[FATAL] RSS Fetch Exception: {e}")
        return []

def translate_news_batch(items):
    """Invokes Node.js bridge with STRICT absolute paths."""
    if not items:
        return {}

    titles = [item['title'] for item in items]
    prompt = f"""You are a professional financial translator.
Translate these {len(titles)} headlines into JP, CN, ES, HI, ID, AR.
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
            log_diag(f"STDERR: {stderr}")
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
             except:
                 log_diag(f"[FATAL] Could not parse AI response JSON: {inner_text[:200]}")
                 create_failure_flag("JSON Parse Error")
                 return {}

        final_json_str = json_match.group(1)
        data = json.loads(final_json_str)
        
        required = ["JP", "CN", "ES", "HI", "ID", "AR"]
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
        "last_updated": datetime.utcnow().isoformat() + "Z"
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
        "last_updated": datetime.utcnow().isoformat() + "Z"
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
