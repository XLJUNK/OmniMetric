
import os
import json
import sys
from enhance_wiki import WikiEnhancer

def verify_generation(lang="JP"):
    enhancer = WikiEnhancer()
    items = enhancer.get_all_items()
    if not items:
        print("No items found.")
        return

    # Use 'net-liquidity' as test case if found, else first item
    test_item = next((i for i in items if i['slug'] == 'net-liquidity'), items[0])
    slug = test_item['slug']
    
    print(f"--- TESTING GENERATION FOR {slug} ({lang}) ---")
    
    # Ensure we regenerate it
    save_path = os.path.join("c:\\Users\\shingo_kosaka.ARGOGRAPHICS\\Desktop\\GlobalMacroSignal\\backend\\data\\wiki_heavy", f"{slug}-{lang.lower()}.json")
    if os.path.exists(save_path):
        os.remove(save_path)
    
    enhancer.generate_report(test_item, lang)
    
    if not os.path.exists(save_path):
        print(f"[FAIL] {save_path} was not created.")
        return

    with open(save_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    sections = data.get("sections", {})
    required_keys = ["summary", "deep_dive", "council_debate", "forecast_risks", "gms_conclusion"]
    missing_keys = [k for k in required_keys if not sections.get(k)]
    
    if missing_keys:
        print(f"[FAIL] Missing or empty sections: {missing_keys}")
    else:
        print("[PASS] All required sections are present.")

    # Verify council_debate keys
    try:
        council = json.loads(sections["council_debate"])
        expert_keys = ["geopolitics", "macro", "quant", "technical", "policy", "tech"]
        missing_experts = [k for k in expert_keys if k not in council]
        if missing_experts:
            print(f"[FAIL] Missing expert keys in council_debate: {missing_experts}")
            print(f"Actual keys: {list(council.keys())}")
        else:
            print("[PASS] Council debate keys are correct English IDs.")
    except Exception as e:
        print(f"[FAIL] Could not parse council_debate as JSON: {e}")

    # Output content preview
    print("\n--- CONTENT PREVIEW ---")
    print(f"Summary length: {len(sections.get('summary', ''))}")
    print(f"Deep Dive preview: {sections.get('deep_dive', '')[:100]}...")
    
if __name__ == "__main__":
    lang = sys.argv[1] if len(sys.argv) > 1 else "JP"
    verify_generation(lang)
