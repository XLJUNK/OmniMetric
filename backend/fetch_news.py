import os
import requests
import xml.etree.ElementTree as ET
import json
import time
from datetime import datetime
from dotenv import load_dotenv

# Load environment
load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GATEWAY_SLUG = os.getenv("VERCEL_AI_GATEWAY_SLUG", "omni-metric")

# Target Languages
LANG_MAP = {
    'JP': 'Japanese',
    'CN': 'Simplified Chinese',
    'ES': 'Spanish',
    'HI': 'Hindi',
    'ID': 'Indonesian',
    'AR': 'Arabic'
}

def log_diag(msg):
    """Simple logger for news module"""
    print(f"[NEWS_ENGINE] {msg}")

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
    """Translates all headlines using VERCEL AI GATEWAY (HTTP/REST) to bypass firewall."""
    if not GEMINI_KEY:
        log_diag("Skipping translation: GEMINI_API_KEY is missing.")
        return {}
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
Output ONLY a raw JSON object where keys are the 2-letter codes (JP, CN, ES, HI, ID, AR) and values are arrays of translated strings in the same order as input.

Input: {json.dumps(titles)}

Example Output:
{{
  "JP": ["Translation 1", "Translation 2"],
  "CN": ["Translation 1", "Translation 2"]
}}"""

    # VERCEL GATEWAY CONFIGURATION
    model_name = "gemini-2.0-flash-001"
    url = f"https://gateway.ai.vercel.com/v1/{GATEWAY_SLUG}/google/models/{model_name}:generateContent"
    
    headers = {
        "Content-Type": "application/json",
        "x-vercel-ai-gateway-provider": "google",
        "x-vercel-ai-gateway-cache": "disable",
        "User-Agent": "OmniMetric-NewsFetcher/1.0"
    }
    
    proxy_url = f"{url}?key={GEMINI_KEY}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    for attempt in range(2):
        try:
            log_diag(f"Sending Translation Request to Gateway (Attempt {attempt+1})...")
            response = requests.post(proxy_url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and result['candidates']:
                    text = result['candidates'][0]['content']['parts'][0]['text']
                    
                    # Cleanup JSON
                    text = text.replace('```json', '').replace('```', '').strip()
                    if '{' in text:
                        text = text[text.find('{'):text.rfind('}')+1]
                    
                    try:
                        translated_data = json.loads(text)
                        
                        # VALIDATION: Check for all keys
                        missing = [code for code in LANG_MAP.keys() if code not in translated_data]
                        if not missing:
                            log_diag("[SUCCESS] Translation complete and validated.")
                            return translated_data
                        else:
                            log_diag(f"[WARN] Partial translation. Missing: {missing}")
                            # Keep what we have, better than nothing
                            return translated_data
                    except json.JSONDecodeError:
                        log_diag("[ERROR] Failed to parse AI JSON response.")
            else:
                log_diag(f"[FAIL] Gateway Error {response.status_code}: {response.text}")
                
            time.sleep(1) # Backoff
            
        except Exception as e:
            log_diag(f"[EXCEPTION] Gateway Connection Failed: {e}")
            
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
    # Test run
    payload = get_news_payload()
    print(json.dumps(payload, indent=2, ensure_ascii=False))
