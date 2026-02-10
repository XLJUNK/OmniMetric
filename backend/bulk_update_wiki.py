import os

def update_wiki_json():
    # Corrected path to point to data/wiki_heavy
    wiki_dir = r"c:\Users\shingo_kosaka.ARGOGRAPHICS\Desktop\GlobalMacroSignal\GlobalMacroSignal\frontend\data\wiki_heavy"
    
    # Broader search terms to catch more "AI" references
    replacements = {
        "AI Analysis": "Algorithmic Analysis",
        "AI Insight": "Proprietary Quantitative Insight",
        "AI Summaries": "Algorithmic Intelligence Summaries",
        "AI-Generated": "Algorithm-Driven",
        "AIインサイト": "独自アルゴリズム解析",
        "AI分析": "定量的アルゴリズム分析",
        "AIの分析": "アルゴリズムによる分析",
        " AI ": " Algorithmic Intelligence ",
        " AI": " Algorithmic Intelligence",
        "AI ": "Algorithmic Intelligence ",
        "AI（": "アルゴリズム（",
        "AIによる": "アルゴリズムによる",
        "AI活用": "アルゴリズム活用",
        "GMS Macro AI Analysis": "Quantitative AI Analysis",
        "GMSマクロAI分析": "定量的AI解析",
        "analyse industrielle GMS": "analyse algorithmique industrielle GMS",
        "l'ère de l'intelligence artificielle": "l'ère de l'intelligence algorithmique"
    }

    count = 0
    if not os.path.exists(wiki_dir):
        print(f"Directory not found: {wiki_dir}")
        return

    for filename in os.listdir(wiki_dir):
        if filename.endswith(".json"):
            filepath = os.path.join(wiki_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                for old, new in replacements.items():
                    content = content.replace(old, new)
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    count += 1
                    print(f"Updated {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print(f"Total files updated: {count}")

if __name__ == "__main__":
    update_wiki_json()
