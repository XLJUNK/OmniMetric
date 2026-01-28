import os
import json
import time
import requests
import re
import sys
from datetime import datetime, timezone

# --- CONFIGURATION (V4.7-777 OPTIMIZATION) ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# FIX: Direct write to frontend data to ensure consistency without copy step
DATA_DIR = os.path.join(BASE_DIR, "..", "frontend", "data", "wiki_heavy")
FRONTEND_DATA_DIR = os.path.join(BASE_DIR, "..", "frontend", "data")
PROGRESS_FILE = os.path.join(DATA_DIR, "progress.json")
LANGS = ["EN", "JP", "CN", "ES", "HI", "ID", "AR"]

# CRITICAL: MODEL SELECTION
MODEL_NAME = "gemini-2.5-flash"
API_KEY = os.getenv("GEMINI_API_KEY")

# CRITICAL: RATE LIMIT SETTINGS
REQUEST_INTERVAL = 15  # Seconds between requests (Strict "Stream" Mode)
MAX_RETRIES = 5
BASE_BACKOFF = 60      # Start with 60s for 429 errors

PERSONA_LABELS = {
    "EN": { "geopolitics": "Geopolitical Strategist", "macro": "Macroeconomic Analyst", "quant": "Quant & Data Scientist", "technical": "Technical Analyst", "policy": "Policy & Regulatory Advisor", "tech": "AI & Future Tech Researcher" },
    "JP": { "geopolitics": "地政学ストラテジスト", "macro": "マクロ経済アナリスト", "quant": "クオンツ・データサイエンティスト", "technical": "テクニカル・アナリスト", "policy": "政策・規制リスクアドバイザー", "tech": "AI・次世代テクノロジー研究者" },
    "CN": { "geopolitics": "地缘政治策略师", "macro": "宏观经济分析师", "quant": "量化与数据科学家", "technical": "技术分析师", "policy": "政策与监管顾问", "tech": "AI与未来科技研究员" },
    "ES": { "geopolitics": "Estratega Geopolítico", "macro": "Analista Macroeconómico", "quant": "Científico de Datos y Quant", "technical": "Analista Técnico", "policy": "Asesor de Políticas y Regulación", "tech": "Investigador de IA y Tecnología Futura" },
    "HI": { "geopolitics": "भू-राजनीतिक रणनीतिकार", "macro": "मैक्रोइकॉनॉमिक एनालिस्ट", "quant": "क्वांट और डेटा वैज्ञानिक", "technical": "तकनीकी विश्लेषक", "policy": "नीति और नियामक सलाहकार", "tech": "एआई और भविष्य के तकनीकी शोधकर्ता" },
    "ID": { "geopolitics": "Ahli Strategi Geopolitik", "macro": "Analis Makroekonomi", "quant": "Ilmuwan Data & Kuant", "technical": "Analis Teknikal", "policy": "Penasihat Kebijakan & Regulasi", "tech": "Peneliti AI & Teknologi Masa Depan" },
    "AR": { "geopolitics": "خبير استراتيجي جيوسياسي", "macro": "محلل اقتصاد كلي", "quant": "عالم كوانت وبيانات", "technical": "محلل فني", "policy": "مستشار السياسات والتنظيم", "tech": "باحث في الذكاء الاصطناعي وتكنولوجيا المستقبل" }
}

class WikiEnhancer:
    def __init__(self):
        os.makedirs(DATA_DIR, exist_ok=True)
        self.glossary = self._load_json("glossary-en.json")
        self.technical = self._load_json("technical-en.json")
        self.maxims = self._load_json("maxims-en.json")
        self.completed_tasks = self._load_progress()

    def _load_progress(self):
        if os.path.exists(PROGRESS_FILE):
             try:
                 with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
                     return set(json.load(f))
             except:
                 pass
        return set()

    def _save_progress(self, task_id):
        self.completed_tasks.add(task_id)
        with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
            json.dump(list(self.completed_tasks), f)

    def _load_json(self, filename):
        path = os.path.join(FRONTEND_DATA_DIR, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def get_all_items(self):
        items = []
        for item in self.glossary:
            items.append({"slug": item["id"], "title": item["term"], "type": "glossary", "category": item["category"]})
        for cat in self.technical:
            for ind in cat["indicators"]:
                # Slugify consistent with frontend
                items.append({"slug": self._slugify(ind["name"]), "title": ind["name"], "type": "technical", "category": cat["category"]})
        for cat in self.maxims:
            for quote in cat["quotes"]:
                items.append({"slug": quote["id"], "title": f"Maxim: {quote['text'][:30]}...", "type": "maxim", "category": cat["category"]})
        return items

    def _slugify(self, text):
        return re.sub(r'[^a-zA-Z0-9]+', '-', text.lower()).strip('-')

    def _mask_secret(self, text):
        if not API_KEY: return text
        return text.replace(API_KEY, "********")


    def generate_report(self, item, lang):
        task_id = f"{item['slug']}-{lang}"
        if task_id in self.completed_tasks:
            print(f"  [SKIP] {task_id} (Already in progress.json)")
            return

        slug = item["slug"]
        save_path = os.path.join(DATA_DIR, f"{slug}-{lang.lower()}.json")
        
        # Double check file existence
        if os.path.exists(save_path):
            self._save_progress(task_id)
            print(f"  [SKIP] {task_id} (File exists)")
            return

        print(f"  [GENERATE] {slug} ({lang})...")
        prompt = self._build_prompt(item, lang)
        
        try:
            content = self._call_ai(prompt)
            if not content: return

            sections = self._parse_sections(content)
            
            # --- COUNCIL KEY FIX ---
            if "council_debate" in sections and sections["council_debate"]:
                try:
                    p = json.loads(sections["council_debate"])
                    # Valid English Keys
                    valid_keys = ["geopolitics", "macro", "quant", "technical", "policy", "tech"]
                    if not all(k in p for k in valid_keys):
                        # Attempt Repair: Map localized values back to English keys
                        new_p = {}
                        # Reverse map for THIS language
                        local_labels = PERSONA_LABELS.get(lang, {})
                        rev_map = {v: k for k, v in local_labels.items()}
                        
                        for pk, pv in p.items():
                            if pk in valid_keys:
                                new_p[pk] = pv
                            elif pk in rev_map:
                                new_p[rev_map[pk]] = pv
                            else:
                                # Fallback: if key matches standard EN key (e.g. "Geopolitical Strategist")
                                found = False
                                for vk, label in PERSONA_LABELS["EN"].items():
                                    if pk == label:
                                        new_p[vk] = pv
                                        found = True
                                        break
                                if not found:
                                    new_p[pk] = pv # Keep as is if no map found
                        
                        sections["council_debate"] = json.dumps(new_p, ensure_ascii=False)
                except:
                    pass
            # -----------------------

            report = {
                "slug": slug,
                "lang": lang,
                "title": item["title"],
                "type": item["type"],
                "category": item["category"],
                "sections": sections,
                "model": MODEL_NAME,
                "generated_at": datetime.now(timezone.utc).isoformat()
            }
            with open(save_path, "w", encoding="utf-8") as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            
            self._save_progress(task_id)
            print(f"  [SUCCESS] {slug}-{lang.lower()}.json created.")
            
        except Exception as e:
            print(f"  [ERROR] {slug}: {e}")

    def _build_prompt(self, item, lang):
        labels = PERSONA_LABELS.get(lang, PERSONA_LABELS["EN"])
        
        return f"""
TERM: "{item['title']}"
TYPE: {item['type']}
CATEGORY: {item['category']}
LANGUAGE: {lang}

Role: You are the OmniMetric Chief Intelligence Officer.
Task: Write a heavy-weight, professional research report (V4.7-777 Spec) in {lang}.

REQUIREMENTS for "The Council" Debate:
- You must simulate a debate between 6 experts.
- IMPORTANT: They must NOT all agree. Include conflicting viewpoints and diverse interpretations of data.
- The "Quant" should be skeptical of the "Macro" narrative if data doesn't support it.
- The "Geopolitics" expert should highlight risks that "Technical" analysis misses.

SECTIONS (Return as JSON):
1. summary: Institutional overview (300-500 chars).
2. deep_dive: Historical context and 2026 impact (300-500 chars).
3. council_debate: A JSON Object with these 6 English keys: "geopolitics", "macro", "quant", "technical", "policy", "tech".
4. forecast_risks: 1-3 year outlook including Black Swan scenarios (300-500 chars).
5. gms_conclusion: Final verdict on risk tolerance (300-500 chars).

OUTPUT FORMAT: Return ONLY a valid JSON object.
"""

    def _call_ai(self, prompt):
        url = f"https://generativelanguage.googleapis.com/v1/models/{MODEL_NAME}:generateContent?key={API_KEY}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        
        current_backoff = BASE_BACKOFF
        
        for attempt in range(MAX_RETRIES):
            try:
                resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=120)
                
                if resp.status_code == 200:
                    return resp.json()['candidates'][0]['content']['parts'][0]['text']
                elif resp.status_code == 429:
                    print(f"    [429] Rate limit hit. Backoff {current_backoff}s... (Attempt {attempt+1}/{MAX_RETRIES})")
                    time.sleep(current_backoff)
                    current_backoff *= 2 # Exponential Backoff
                else:
                    print(f"    [AI API Error] {resp.status_code} - {self._mask_secret(resp.text)[:200]}")
                    break
            except Exception as e:
                print(f"    [AI Exception] {self._mask_secret(str(e))[:100]}...") # Masked log
                time.sleep(10)
        return None

    def _parse_sections(self, content):
        sections = {"summary": "", "deep_dive": "", "council_debate": "", "forecast_risks": "", "gms_conclusion": ""}
        try:
            clean = content.strip().replace("```json", "").replace("```", "").strip()
            # Simple header fallback parsing similar to previous logic omitted for brevity, 
            # assuming reasonably good JSON from Gemini 2.5
            # Ideally we use regex to extract JSON block if mixed with text
            json_match = re.search(r'\{.*\}', clean, re.DOTALL)
            if json_match:
                 data = json.loads(json_match.group())
                 for k in sections:
                     if k in data:
                         val = data[k]
                         if isinstance(val, dict):
                             sections[k] = json.dumps(val, ensure_ascii=False)
                         else:
                             sections[k] = str(val)
        except:
             pass 
             # Fallback logic could be re-added here if needed
        return sections

if __name__ == "__main__":
    try:
        if not API_KEY:
            print("[ERROR] GEMINI_API_KEY not found.")
            sys.exit(1)
            
        enhancer = WikiEnhancer()
        items = enhancer.get_all_items()
        
        print(f"--- STARTING WIKI GENERATION STREAM (V4.7-777) ---")
        
        # 1. Calculate Global Progress
        total_tasks = len(items) * len(LANGS)
        existing_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.json')]
        existing_count = len(existing_files)
        progress_pct = (existing_count / total_tasks) * 100 if total_tasks > 0 else 0
        
        print(f"Progress: {existing_count}/{total_tasks} ({progress_pct:.2f}%)")
        
        if existing_count >= total_tasks:
            print("ALL_WIKI_GENERATED_SIGNAL")
            sys.exit(0)

        # 2. Select Batch (Max 5 Items that are incomplete)
        BATCH_SIZE = 5
        batch_items = []
        
        for item in items:
            # Check if this item is fully complete
            is_complete = True
            for lang in LANGS:
                # Check file existence directly
                fname = f"{item['slug']}-{lang.lower()}.json"
                if not os.path.exists(os.path.join(DATA_DIR, fname)):
                    is_complete = False
                    break
            
            if not is_complete:
                batch_items.append(item)
                if len(batch_items) >= BATCH_SIZE:
                    break
        
        print(f"Batch Target: {len(batch_items)} items (Max {BATCH_SIZE})")
        
        # 3. Process Batch
        processed_count = 0
        for item in batch_items:
            print(f"Processing Item: {item['slug']}...")
            for lang in LANGS:
                enhancer.generate_report(item, lang)
                # STRICT INTERVAL (Flow Control)
                time.sleep(REQUEST_INTERVAL)
            processed_count += 1
            
        print(f"Batch Complete. Processed {processed_count} items.")
                
    except KeyboardInterrupt:
        print("\n[STOP] Generation interrupted by user.")
        sys.exit(0)
    except Exception as e:
        print(f"[CRITICAL FAILURE] {e}")
        sys.exit(1)
