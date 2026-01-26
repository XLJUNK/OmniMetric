
import os
import json
import time
import requests
import re
import sys
from datetime import datetime
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))
except ImportError:
    pass

# CONFIGURATION
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data", "wiki_heavy")
FRONTEND_DATA_DIR = os.path.join(BASE_DIR, "..", "frontend", "data")
LANGS = ["EN", "JP", "CN", "ES", "HI", "ID", "AR"]

# AI CONFIG
API_KEY = os.getenv("GEMINI_API_KEY")

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
    },
    "CN": {
        "geopolitics": "地缘政治策略师",
        "macro": "宏观经济分析师",
        "quant": "量化与数据科学家",
        "technical": "技术分析师",
        "policy": "政策与监管顾问",
        "tech": "AI与未来科技研究员"
    },
    "ES": {
        "geopolitics": "Estratega Geopolítico",
        "macro": "Analista Macroeconómico",
        "quant": "Científico de Datos y Quant",
        "technical": "Analista Técnico",
        "policy": "Asesor de Políticas y Regulación",
        "tech": "Investigador de IA y Tecnología Futura"
    },
    "HI": {
        "geopolitics": "भू-राजनीतिक रणनीतिकार",
        "macro": "मैक्रोइकॉनॉमिक एनालिस्ट",
        "quant": "क्वांट और डेटा वैज्ञानिक",
        "technical": "तकनीकी विश्लेषक",
        "policy": "नीति और नियामक सलाहकार",
        "tech": "एआई और भविष्य के तकनीकी शोधकर्ता"
    },
    "ID": {
        "geopolitics": "Ahli Strategi Geopolitik",
        "macro": "Analis Makroekonomi",
        "quant": "Ilmuwan Data & Kuant",
        "technical": "Analis Teknikal",
        "policy": "Penasihat Kebijakan & Regulasi",
        "tech": "Peneliti AI & Teknologi Masa Depan"
    },
    "AR": {
        "geopolitics": "خبير استراتيجي جيوسياسي",
        "macro": "محلل اقتصاد كلي",
        "quant": "عالم كوانت وبيانات",
        "technical": "محلل فني",
        "policy": "مستشار السياسات والتنظيم",
        "tech": "باحث في الذكاء الاصطناعي وتكنولوجيا المستقبل"
    }
}

class WikiEnhancer:
    def __init__(self):
        os.makedirs(DATA_DIR, exist_ok=True)
        self.glossary = self._load_json("glossary-en.json")
        self.technical = self._load_json("technical-en.json")
        self.maxims = self._load_json("maxims-en.json")

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
                items.append({"slug": self._slugify(ind["name"]), "title": ind["name"], "type": "technical", "category": cat["category"]})
        for cat in self.maxims:
            for quote in cat["quotes"]:
                items.append({"slug": quote["id"], "title": f"Maxim: {quote['text'][:30]}...", "type": "maxim", "category": cat["category"]})
        return items

    def _slugify(self, text):
        return re.sub(r'[^a-zA-Z0-9]+', '-', text.lower()).strip('-')

    def test_connection(self):
        print(f"--- TESTING API CONNECTION ---")
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={API_KEY}"
        payload = {"contents": [{"parts": [{"text": "Hello"}]}]}
        
        for attempt in range(5):
            try:
                resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=20)
                if resp.status_code == 200:
                    print("API CONNECTION SUCCESSFUL")
                    return True
                elif resp.status_code == 429:
                    print(f"API CONNECTION BUSY (429). Waiting 60s... (Attempt {attempt+1}/5)")
                    time.sleep(60)
                else:
                    print(f"API CONNECTION FAILED: {resp.status_code} - {resp.text}")
                    return False
            except Exception as e:
                print(f"API CONNECTION EXCEPTION: {e}")
                time.sleep(5)
        return False

    def generate_report(self, item, lang):
        slug = item["slug"]
        save_path = os.path.join(DATA_DIR, f"{slug}-{lang.lower()}.json")
        # To ensure we have the correct English keys in existing files, 
        # we might want to overwrite if the keys are wrong, but for now let's just use existing logic or check keys.
        if os.path.exists(save_path): 
            try:
                with open(save_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    # If council_debate doesn't have English keys, we should regenerate
                    council = data.get("sections", {}).get("council_debate", "")
                    if "geopolitics" in council: return # Already correct
            except:
                pass

        print(f"  [GENERATE] {slug} ({lang})...")
        prompt = self._build_prompt(item, lang)
        
        try:
            content = self._call_ai(prompt)
            if not content: return

            sections = self._parse_sections(content)
            # Validation: Ensure all 6 experts are present as keys
            if "council_debate" in sections and sections["council_debate"]:
                try:
                    p = json.loads(sections["council_debate"])
                    if not all(k in p for k in ["geopolitics", "macro", "quant", "technical", "policy", "tech"]):
                        print(f"    [WARN] Incomplete/Incorrect council debate keys. Attempting cross-language fix...")
                        # Map ALL possible localized keys across ALL languages back to English IDs
                        global_rev_map = {}
                        for lcode in PERSONA_LABELS:
                            for eid, label in PERSONA_LABELS[lcode].items():
                                global_rev_map[label] = eid
                        
                        new_p = {}
                        for pk, pv in p.items():
                            if pk in global_rev_map: 
                                new_p[global_rev_map[pk]] = pv
                            else: 
                                new_p[pk] = pv
                        sections["council_debate"] = json.dumps(new_p, ensure_ascii=False)
                except:
                    pass

            report = {
                "slug": slug,
                "lang": lang,
                "title": item["title"],
                "type": item["type"],
                "category": item["category"],
                "sections": sections,
                "generated_at": datetime.now().isoformat()
            }
            with open(save_path, "w", encoding="utf-8") as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
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

Write a heavy-weight, professional research report in {lang}.

STRICT REQUIREMENTS:
- summary: Institutional overview (300-500 characters).
- deep_dive: Historical context and 2026 impact (300-500 characters).
- council_debate: A multi-perspective debate. RETURN THIS AS A JSON OBJECT.
  - USE THESE EXACT ENGLISH KEYS: "geopolitics", "macro", "quant", "technical", "policy", "tech".
  - Each expert's insight should be significant (approx 150-200 characters each).
- forecast_risks: 1-3 year outlook and black swan scenarios (300-500 characters).
- gms_conclusion: Final verdict on risk tolerance (300-500 characters).
- TOTAL REPORT LENGTH MUST EXCEED 1,500 CHARACTERS.

STRUCTURE (You MUST return exactly these keys):
1. summary
2. deep_dive
3. council_debate (with keys: geopolitics, macro, quant, technical, policy, tech)
4. forecast_risks
5. gms_conclusion

TONE: Bloomberg-terminal style, institutional, sophisticated. Unique to OmniMetric.

OUTPUT FORMAT: Return ONLY a valid JSON object. No preamble, no markdown formatting outside the JSON block.
EXAMPLE FORMAT:
{{
  "summary": "...",
  "deep_dive": "...",
  "council_debate": {{
    "geopolitics": "...",
    "macro": "...",
    "quant": "...",
    "technical": "...",
    "policy": "...",
    "tech": "..."
  }},
  "forecast_risks": "...",
  "gms_conclusion": "..."
}}
"""

    def _call_ai(self, prompt):
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={API_KEY}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        
        max_retries = 5
        base_delay = 60
        
        for attempt in range(max_retries):
            try:
                resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=120)
                if resp.status_code == 200:
                    return resp.json()['candidates'][0]['content']['parts'][0]['text']
                elif resp.status_code == 429:
                    delay = base_delay * (2 ** attempt)
                    print(f"    [429] Rate limit hit. Waiting {delay}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(delay)
                else:
                    print(f"    [AI API Error] {resp.status_code} - {resp.text[:200]}")
                    break
            except Exception as e:
                print(f"    [AI Exception] {e}")
                time.sleep(10)
        return None

    def _parse_sections(self, content):
        sections = {"summary": "", "deep_dive": "", "council_debate": "", "forecast_risks": "", "gms_conclusion": ""}
        
        # Priority 1: Strict JSON parsing
        try:
            # Clean possible markdown wrapping if AI ignores the "ONLY JSON" instruction
            clean_content = content.strip()
            if clean_content.startswith("```json"):
                clean_content = clean_content.replace("```json", "", 1).replace("```", "", 1).strip()
            elif clean_content.startswith("```"):
                clean_content = clean_content.replace("```", "", 1).replace("```", "", 1).strip()
            
            json_match = re.search(r'\{.*\}', clean_content, re.DOTALL)
            if json_match:
                extracted = json.loads(json_match.group())
                for key in sections.keys():
                    if key in extracted:
                        val = extracted[key]
                        if isinstance(val, dict):
                            sections[key] = json.dumps(val, ensure_ascii=False)
                        else:
                            sections[key] = str(val)
                
                # Check if we got real content in most keys
                if len(sections["council_debate"]) > 100:
                    return sections
        except Exception as e:
            print(f"    [PARSER] JSON parsing failed, falling back to headers: {e}")

        # Priority 2: Header-based parsing (Fallback)
        # We include common translated headers to be robust
        header_map = {
            "summary": ["SUMMARY", "概要", "要約", "RESUMEN", "सारांश", "RINGKASAN", "ملخص"],
            "deep_dive": ["DEEP DIVE", "詳細解説", "専門解説", "深入探討", "ANÁLISIS PROFUNDO", "गहन विश्लेषण", "PEMBAHASAN MENDALAM", "تعمق"],
            "council_debate": ["COUNCIL DEBATE", "評議会", "知の評議会", "讨论", "DEBATE DEL CONSEJO", "परिषद की बहस", "DEBAT DEWAN", "مناقشة المجلس"],
            "forecast_risks": ["FORECAST", "予測", "预测", "PRONÓSTICO", "पूर्वानुमान", "PREDIKSI", "توقعات"],
            "gms_conclusion": ["CONCLUSION", "結論", "结论", "CONCLUSIÓN", "निष्कर्ष", "KESIMPULAN", "خاتمة"]
        }
        current = None
        for line in content.split('\n'):
            line_upper = line.upper().strip()
            found_header = False
            for key, keywords in header_map.items():
                for kw in keywords:
                    # Look for the keyword as a header (short line, possibly starting with #)
                    if (kw.upper() in line_upper) and (len(line_upper) < 60):
                        current = key
                        found_header = True
                        break
                if found_header: break
            
            if not found_header and current:
                sections[current] += line + "\n"
        
        return {k: v.strip() for k, v in sections.items()}

if __name__ == "__main__":
    enhancer = WikiEnhancer()
    if enhancer.test_connection():
        items = enhancer.get_all_items()
        total_items = len(items)
        total_files_needed = total_items * len(LANGS)
        
        # Count existing files in backend data dir
        existing_count = 0
        if os.path.exists(DATA_DIR):
            existing_count = len([f for f in os.listdir(DATA_DIR) if f.endswith('.json')])
        
        # Calculate Progress
        progress = (existing_count / total_files_needed) * 100 if total_files_needed > 0 else 0
        rem = total_files_needed - existing_count
        print(f"[PROGRESS] {existing_count}/{total_files_needed} files generated ({progress:.1f}%). Remaining: {rem}")

        if existing_count >= total_files_needed:
            print("No tasks remaining. ALL_WIKI_GENERATED_SIGNAL")
            sys.exit(0)

        # Batch Selection: Find up to 5 items with missing language files
        to_process = []
        for item in items:
            missing_langs = []
            for lang in LANGS:
                # Check for file existence
                fname = f"{item['slug']}-{lang.lower()}.json"
                if not os.path.exists(os.path.join(DATA_DIR, fname)):
                    missing_langs.append(lang)
            
            if missing_langs:
                to_process.append((item, missing_langs))
                if len(to_process) >= 5: # BATCH SIZE: 5 items (all langs for each)
                    break
        
        if not to_process:
            print("No tasks remaining. ALL_WIKI_GENERATED_SIGNAL")
            sys.exit(0)

        print(f"Starting batch processing of {len(to_process)} items...")
        for item, langs in to_process:
            print(f"  [TARGET] {item['slug']} (Missing: {langs})")
            for lang in langs:
                enhancer.generate_report(item, lang)
                # Institutional safety delay to avoid Free Tier 429 cascades
                time.sleep(20)
            # Brief pause between items
            time.sleep(10)
        
        # Final check for completion signal in the same run
        final_count = len([f for f in os.listdir(DATA_DIR) if f.endswith('.json')])
        if final_count >= total_files_needed:
            print("Completion detected. ALL_WIKI_GENERATED_SIGNAL")
