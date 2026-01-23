import os
import requests
import xml.etree.ElementTree as ET
import json
import time
import subprocess
import re
from datetime import datetime
from dotenv import load_dotenv

# Load environment
load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GATEWAY_SLUG = os.getenv("VERCEL_AI_GATEWAY_SLUG", "omni-metric")

import sys

# Force UTF-8 for Windows Console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Target Languages
LANG_MAP = {
    'JP': 'Japanese',
    'CN': 'Simplified Chinese',
    'ES': 'Spanish',
    'HI': 'Hindi',
    'ID': 'Indonesian',
    'AR': 'Arabic'
}

GATEWAY_KEY = os.getenv("AI_GATEWAY_API_KEY", "").strip()

def log_diag(msg):
    """Simple logger for news module with encoding safety and file persistence"""
    try:
        # Console output
        print(f"[NEWS_ENGINE] {msg}")
    except UnicodeEncodeError:
        safe_msg = msg.encode('ascii', 'replace').decode('ascii')
        print(f"[NEWS_ENGINE] {safe_msg}")
    except Exception:
        pass

    # File output for difficult environments
    try:
        # Use absolute path for log file to avoid issues in Actions
        log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "news_debug.log")
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(f"{datetime.now().isoformat()} [NEWS_ENGINE] {msg}\n")
    except Exception:
        pass

def fetch_raw_news():
    """Fetches top 6 headlines from CNBC RSS using robust date parsing."""
    FEED_URL = f'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114&t={int(time.time())}'
    try:
        log_diag(f"Fetching RSS feed from {FEED_URL}...")
        res = requests.get(FEED_URL, timeout=10)
        if res.status_code != 200:
            log_diag(f"RSS Fetch Failed: Status {res.status_code}")
            return []
        
        root = ET.fromstring(res.text)
        items = []
        for item in root.findall('.//item')[:6]:
            title = item.find('title').text
            link = item.find('link').text
            pub_date = item.find('pubDate').text
            
            # Basic cleanup
            title = title.replace('<![CDATA[', '').replace(']]>', '').strip()
            link = link.replace('<![CDATA[', '').replace(']]>', '').strip()
            
            # Date ISO conversion
            iso_date = datetime.utcnow().isoformat() + "Z"
            try:
                # CNBC uses RFC 822: "Wed, 21 Jan 2026 14:20:59 EST"
                # Strip timezone name and use simple parsing
                clean_date = pub_date.split(' +')[0].split(' -')[0].strip()
                # Handle EST/EDT manually if present
                clean_date = clean_date.replace(" EST", "").replace(" EDT", "").replace(" GMT", "")
                
                # Try multiple formats
                formats = [
                    "%a, %d %b %Y %H:%M:%S",
                    "%a, %d %b %Y %H:%M:%S %Z",
                    "%d %b %Y %H:%M:%S"
                ]
                
                dt_obj = None
                for fmt in formats:
                    try:
                        dt_obj = datetime.strptime(clean_date, fmt)
                        break
                    except: continue
                
                if dt_obj:
                    # Assume headers are roughly UTC/EST, just format to ISO
                    iso_date = dt_obj.strftime("%Y-%m-%dT%H:%M:%SZ")
            except Exception as e: 
                log_diag(f"Date Parse Warning: {e} for '{pub_date}'")

            items.append({
                "title": title,
                "link": link,
                "isoDate": iso_date
            })
        
        log_diag(f"RSS Fetch Success: {len(items)} items recovered.")
        return items
    except Exception as e:
        log_diag(f"Raw fetch failed: {e}")
        return []

def translate_news_batch(items):
    """Translates headlines using Node.js bridge (bypass Python SSL block)."""
    if not items:
        return {}

    titles = [item['title'] for item in items]
    
    prompt = f"""You are a professional financial translator for a Bloomberg terminal.
Translate the following {len(titles)} US market news headlines into:
- Japanese (JP)
- Simplified Chinese (CN)
- Spanish (ES)
- Hindi (HI)
- Indonesian (ID)
- Arabic (AR)

Maintain a punchy, factual, institutional tone.
Output ONLY a raw JSON object where keys are the 2-letter codes (JP, CN, ES, HI, ID, AR) and values are arrays in same order.

Input: {json.dumps(titles)}"""

    try:
        log_diag("Routing translation through Node.js Bridge...")
        
        # DEFINITIVE ABSOLUTE PATHS
        current_dir = os.path.dirname(os.path.abspath(__file__))
        root_dir = os.path.dirname(current_dir)
        frontend_dir = os.path.join(root_dir, "frontend")
        script_abs_path = os.path.join(frontend_dir, "scripts", "generate_insight.ts")
        
        log_diag(f"Path Reference: cwd={frontend_dir}, script={script_abs_path}")
        
        if not os.path.exists(frontend_dir):
            log_diag(f"[CRITICAL] Frontend directory not found at {frontend_dir}")
            return {}

        # Call npx tsx and pipe prompt via stdin
        # Using npx tsx <absolute_path> with cwd=<frontend_dir>
        # Note: shell=True is ONLY for Windows/CMD. On Linux, list + shell=False is correct.
        cmd = ["npx", "tsx", script_abs_path]
        process = subprocess.Popen(
            cmd, 
            stdin=subprocess.PIPE, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True, 
            encoding='utf-8', 
            shell=(sys.platform == 'win32'),
            cwd=frontend_dir
        )
        stdout, stderr = process.communicate(input=prompt, timeout=90)

        if process.returncode == 0:
            try:
                # ROBUST PARSING: Use regex to extract the JSON object containing "text"
                # This ignores noise like [dotenv] or other log lines
                match = re.search(r'\{"text":.*\}', stdout, re.DOTALL)
                if not match:
                    log_diag(f"[ERROR] No valid JSON with 'text' found in Node stdout. Raw: {stdout[:200]}...")
                    return {}
                
                raw_result = json.loads(match.group(0))
                text = raw_result.get("text", "")
                
                # Extract internal JSON from response text
                text_match = re.search(r'\{.*\}', text, re.DOTALL)
                if not text_match:
                    log_diag(f"[ERROR] No translation JSON found in AI response text: {text[:200]}")
                    return {}
                
                translated_data = json.loads(text_match.group(0))
                
                # VALIDATION: Check if at least one target language exists
                required_langs = ["JP", "CN", "ES", "HI", "ID", "AR"]
                missing_langs = [l for l in required_langs if l not in translated_data]
                
                if missing_langs:
                    log_diag(f"[WARNING] Missing languages in result: {missing_langs}")
                    # We continue but will signal failure later if critical
                
                if "JP" in translated_data:
                    log_diag(f"[SUCCESS] Node Bridge returned {len(translated_data)} languages.")
                    return translated_data
                else:
                    log_diag(f"[ERROR] Critical language 'JP' missing from translation.")
                    return {}

            except Exception as e:
                log_diag(f"[ERROR] Failed to parse Node response: {e}. Raw stdout: {stdout[:500]}")
        else:
            log_diag(f"[ERROR] Node Bridge failed (code {process.returncode}): {stderr}")
            if stdout:
                log_diag(f"Stdout (Failed Run): {stdout[:500]}")
            
    except Exception as e:
        log_diag(f"[EXCEPTION] Node Bridge communication failed: {e}")
        
    return {}

def get_news_payload():
    """Main entry point: Returns raw news and its translations."""
    log_diag("Updating intelligence stream...")
    raw_items = fetch_raw_news()
    if not raw_items:
        log_diag("[ABORT] No raw news fetched. Skipping translation.")
        return None

    translations = translate_news_batch(raw_items)
    
    if not translations:
        log_diag("[ABORT] Translation failed. Using raw news only is NOT allowed for intelligence updates.")
        return None

    return {
        "news": raw_items,
        "translations": translations,
        "last_updated": datetime.utcnow().isoformat() + "Z"
    }

if __name__ == "__main__":
    try:
        payload = get_news_payload()
        
        # Load existing signal file
        script_dir = os.path.dirname(os.path.abspath(__file__))
        signal_path = os.path.join(script_dir, "current_signal.json")
        flag_path = os.path.join(script_dir, "ai_failed.flag")
        
        # Cleanup old failure flag
        if os.path.exists(flag_path):
            os.remove(flag_path)

        data = {}
        if os.path.exists(signal_path):
            with open(signal_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        
        if payload:
            # PROPER UPDATE: We have valid news and translations
            data["intelligence"] = payload
            with open(signal_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            log_diag(f"[DONE] News updated successfully in {signal_path}")
        else:
            # FAIL-SAFE: Preservation of old data
            log_diag("[FAIL-SAFE] Invalid payload detected. Keeping previous intelligence to avoid empty state.")
            # Touch failure flag for Actions detection
            with open(flag_path, "w") as f:
                f.write(f"NEWS_FETCH_OR_TRANSLATION_FAILED_{datetime.now().isoformat()}")
            
            # If intelligence doesn't exist at all, we might want to exit with error
            if "intelligence" not in data:
                log_diag("[CRITICAL] No previous intelligence found. System in blank state.")
                sys.exit(1)
            
            sys.exit(0) # Exit with 0 so Actions continues, but flag handles the alert
        
    except Exception as e:
        log_diag(f"[ERROR] Failed to update news: {e}")
        try:
            flag_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ai_failed.flag")
            with open(flag_path, "w") as f:
                f.write(f"EXCEPTION_IN_NEWS_ENGINE_{e}")
        except: pass
        sys.exit(1)

