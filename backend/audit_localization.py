import os
import json
import re

DATA_DIR = r"c:\Users\shingo_kosaka.ARGOGRAPHICS\Desktop\GlobalMacroSignal\GlobalMacroSignal\frontend\data\wiki_heavy"
LANGS = ["JP", "CN", "ES", "HI", "ID", "AR", "DE", "FR"]

def is_mostly_english(text):
    if not text: return False
    # Count English-like words (3 or more chars, basic alphanumeric)
    words = re.findall(r'[a-zA-Z]{3,}', text)
    if not words: return False
    # If more than 50% of "words" look English-ish, and there are many of them
    return len(words) > 5

def audit():
    needs_fix = []
    files = [f for f in os.listdir(DATA_DIR) if f.endswith(".json") and f != "progress.json"]
    
    for fname in files:
        path = os.path.join(DATA_DIR, fname)
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            lang = data.get("lang", "").upper()
            if lang in LANGS:
                summary = data.get("sections", {}).get("summary", "")
                if is_mostly_english(summary):
                    needs_fix.append({
                        "file": fname,
                        "lang": lang,
                        "slug": data.get("slug")
                    })
        except Exception as e:
            print(f"Error reading {fname}: {e}")
            
    return needs_fix

if __name__ == "__main__":
    results = audit()
    print(f"Found {len(results)} files that need localization fix:")
    for r in results:
        print(f"{r['slug']} ({r['lang']}) -> {r['file']}")
    
    with open("audit_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
