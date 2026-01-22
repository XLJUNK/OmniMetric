import os
import requests
import xml.etree.ElementTree as ET
import json
import google.generativeai as genai
from datetime import datetime
from dotenv import load_dotenv

# Load environment
load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Target Languages
LANG_MAP = {
    'JP': 'Japanese',
    'CN': 'Simplified Chinese',
    'ES': 'Spanish',
    'HI': 'Hindi',
    'ID': 'Indonesian',
    'AR': 'Arabic'
}

def fetch_raw_news():
    """Fetches top 6 headlines from CNBC RSS."""
    FEED_URL = 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114'
    try:
        res = requests.get(FEED_URL, timeout=10)
        if res.status_code != 200:
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
            iso_date = datetime.now().isoformat()
            try:
                # CNBC uses RFC 822: "Wed, 21 Jan 2026 14:20:59 EST"
                # Simple fallback if parsing fails
                iso_date = datetime.strptime(pub_date.split(' +')[0].split(' -')[0].strip(), "%a, %d %b %Y %H:%M:%S").isoformat()
            except: pass

            items.append({
                "title": title,
                "link": link,
                "isoDate": iso_date
            })
        return items
    except Exception as e:
        print(f"[FETCH_NEWS] Raw fetch failed: {e}")
        return []

def translate_news_batch(items):
    """Translates all headlines into all target languages in a single AI pass."""
    if not GEMINI_KEY:
        print("[FETCH_NEWS] Skipping translation: GEMINI_API_KEY is missing.")
        return {}
    if not items:
        return {}

    genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')

    titles = [item['title'] for item in items]
    
    # Structure: { "JP": ["T1", "T2"...], "CN": [...] }
    translations = {}
    
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

    try:
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        
        # Robust JSON extraction
        if '{' in text and '}' in text:
            start = text.find('{')
            end = text.rfind('}') + 1
            text = text[start:end]
            
        translated_data = json.loads(text)
        return translated_data
    except Exception as e:
        print(f"[FETCH_NEWS] AI Translation failed: {e}")
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
