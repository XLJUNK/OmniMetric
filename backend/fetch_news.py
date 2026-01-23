import os
import requests
import xml.etree.ElementTree as ET
import json
import time
import subprocess
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
        with open("news_debug.log", "a", encoding="utf-8") as f:
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
        # Resolve path to generate_insight.ts (relative to root)
        script_path = os.path.join("frontend", "scripts", "generate_insight.ts")
        
        # Call npx tsx and pipe prompt via stdin
        cmd = ["npx", "tsx", script_path]
        process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', shell=True)
        stdout, stderr = process.communicate(input=prompt, timeout=45)

        if process.returncode == 0:
            # generate_insight.ts outputs {"text": "..."}
            try:
                # Find the actual JSON start if there's noise
                json_start_node = stdout.find('{')
                json_end_node = stdout.rfind('}') + 1
                if json_start_node != -1 and json_end_node > json_start_node:
                    clean_stdout = stdout[json_start_node:json_end_node]
                    raw_result = json.loads(clean_stdout)
                else:
                    log_diag(f"[ERROR] No JSON found in Node stdout: {stdout}")
                    return {}

                text = raw_result.get("text", "")
                
                # Extract JSON from text (translated data)
                text = text.replace('```json', '').replace('```', '').strip()
                if '{' in text:
                    text = text[text.find('{'):text.rfind('}')+1]
                
                translated_data = json.loads(text)
                if "JP" in translated_data:
                    log_diag(f"[SUCCESS] Node Bridge returned {len(translated_data)} languages.")
                    return translated_data
            except Exception as e:
                log_diag(f"[ERROR] Failed to parse Node response: {e}. Raw stdout: {stdout[:500]}")
        else:
            log_diag(f"[ERROR] Node Bridge failed (code {process.returncode}): {stderr}")
            
    except Exception as e:
        log_diag(f"[EXCEPTION] Node Bridge communication failed: {e}")
        
    return {}



def get_news_payload():
    """Main entry point: Returns raw news and its translations."""
    print("[FETCH_NEWS] Updating intelligence stream...")
    raw_items = fetch_raw_news()
    if not raw_items:
        return {"news": [], "translations": {}}

    translations = translate_news_batch(raw_items)
    
    return {
        "news": raw_items, # English base
        "translations": translations,
        "last_updated": datetime.utcnow().isoformat() + "Z"
    }

if __name__ == "__main__":
    # Standalone Execution (GitHub Actions / Manual Update)
    try:
        payload = get_news_payload()
        
        # Load existing signal file to merge
        signal_path = os.path.join(os.path.dirname(__file__), "current_signal.json")
        data = {}
        if os.path.exists(signal_path):
            with open(signal_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        
        # Merge intelligence
        data["intelligence"] = payload
        
        # Save back
        with open(signal_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            
        print(f"[SUCCESS] News updated in {signal_path}")
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        
    except Exception as e:
        print(f"[ERROR] Failed to update news: {e}")
        sys.exit(1)
