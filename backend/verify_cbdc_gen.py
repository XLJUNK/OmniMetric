
import os
import json
import time
import requests
from dotenv import load_dotenv

# Configuration
load_dotenv(".env")
KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-2.5-flash"
BASE_URL = f"https://generativelanguage.googleapis.com/v1/models/{MODEL}:generateContent?key={KEY}"

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BACKEND_DIR, "data", "wiki_heavy")
os.makedirs(DATA_DIR, exist_ok=True)

ITEM = {
    "slug": "cbdc-adoption-rate",
    "title": "CBDC Adoption Rate",
    "type": "glossary",
    "category": "Liquidity"
}

PERSONA_LABELS = {
    "EN": {
        "geopolitics": "Geopolitical Strategist",
        "macro": "Macroeconomic Analyst",
        "quant": "Quant & Data Scientist",
        "technical": "Technical Analyst",
        "policy": "Policy & Regulatory Advisor",
        "tech": "AI & Future Tech Researcher"
    },
    "JP": {
        "geopolitics": "地政学ストラテジスト視点",
        "macro": "マクロ経済アナリスト視点",
        "quant": "クオンツ・データサイエンティスト視点",
        "technical": "テクニカル・アナリスト視点",
        "policy": "政策・規制リスクアドバイザー視点",
        "tech": "AI・次世代テクノロジー研究者視点"
    }
}

def build_prompt(lang):
    labels = PERSONA_LABELS[lang]
    return f"""
TERM: "{ITEM['title']}"
TYPE: {ITEM['type']}
CATEGORY: {ITEM['category']}
LANGUAGE: {lang}

Write a heavy-weight, professional research report in {lang}.
STRICT REQUIREMENTS:
- summary: Institutional overview (300-500 characters).
- deep_dive: Historical context and 2026 impact (300-500 characters).
- council_debate: A multi-perspective debate. RETURN THIS AS A JSON OBJECT.
  - USE THESE EXACT KEYS: "geopolitics", "macro", "quant", "technical", "policy", "tech".
  - Each expert's insight should be significant (approx 150-200 characters each).
- forecast_risks: 1-3 year outlook and black swan scenarios (300-500 characters).
- gms_conclusion: Final verdict on risk tolerance (300-500 characters).
- Total character count (Japanese/English characters) MUST exceed 1,500.

TONE: Bloomberg-terminal style.
OUTPUT FORMAT: Return ONLY a valid JSON object. No preamble.
"""

def generate(lang):
    print(f"--- Generating {lang} ---")
    prompt = build_prompt(lang)
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    
    for attempt in range(1, 11):
        try:
            resp = requests.post(BASE_URL, json=payload, headers={"Content-Type": "application/json"}, timeout=120)
            if resp.status_code == 200:
                raw_text = resp.json()['candidates'][0]['content']['parts'][0]['text']
                # Clean markdown
                clean_text = raw_text.strip()
                if clean_text.startswith("```json"):
                    clean_text = clean_text.split("```json")[1].split("```")[0].strip()
                elif clean_text.startswith("```"):
                    clean_text = clean_text.split("```")[1].split("```")[0].strip()
                
                data = json.loads(clean_text)
                
                # Validation and Normalization
                sections = {}
                for key in ["summary", "deep_dive", "council_debate", "forecast_risks", "gms_conclusion"]:
                    val = data.get(key, "")
                    if key == "council_debate" and isinstance(val, dict):
                        sections[key] = json.dumps(val, ensure_ascii=False)
                    else:
                        sections[key] = str(val)
                
                report = {
                    "slug": ITEM["slug"],
                    "lang": lang,
                    "title": ITEM["title"],
                    "type": ITEM["type"],
                    "category": ITEM["category"],
                    "sections": sections,
                    "generated_at": "2026-01-26T17:00:00Z"
                }
                
                save_path = os.path.join(DATA_DIR, f"{ITEM['slug']}-{lang.lower()}.json")
                with open(save_path, "w", encoding="utf-8") as f:
                    json.dump(report, f, indent=2, ensure_ascii=False)
                
                print(f"[SUCCESS] {lang} generated and saved. Total length roughly: {len(str(report))} chars.")
                return True
            elif resp.status_code == 429:
                wait_time = 60
                print(f"[429] Rate limit hit. Waiting {wait_time}s... (Attempt {attempt}/10)")
                time.sleep(wait_time)
            else:
                print(f"[ERROR] {resp.status_code}: {resp.text}")
                time.sleep(10)
        except Exception as e:
            print(f"[EXCEPTION] {e}")
            time.sleep(10)
    return False

if __name__ == "__main__":
    if generate("JP"):
        print("Waiting 30s before EN...")
        time.sleep(30)
        generate("EN")
