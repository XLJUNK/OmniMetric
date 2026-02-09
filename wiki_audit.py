import os
import json
import csv

def audit_wiki_heavy(directory):
    results = []
    for filename in os.listdir(directory):
        if not filename.endswith('.json') or filename == 'progress.json' or filename == 'file_list.txt':
            continue
        
        filepath = os.path.join(directory, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            sections = data.get('sections', {})
            # Total text in sections
            all_text = ""
            for val in sections.values():
                if isinstance(val, str):
                    all_text += val
                elif isinstance(val, dict):
                    for subval in val.values():
                        if isinstance(subval, str):
                            all_text += subval
            
            char_count = len(all_text)
            
            # Check for Council Debate experts
            debate = sections.get('council_debate', {})
            if isinstance(debate, str):
                try:
                    debate = json.loads(debate)
                except:
                    pass
            
            experts = []
            if isinstance(debate, dict):
                experts = list(debate.keys())
            
            expert_count = len(experts)
            has_6_experts = expert_count >= 6
            
            results.append({
                'filename': filename,
                'slug': data.get('slug', ''),
                'lang': data.get('lang', ''),
                'title': data.get('title', ''),
                'char_count': char_count,
                'expert_count': expert_count,
                'experts': ", ".join(experts),
                'has_6_experts': has_6_experts,
                'is_under_1500': char_count < 1500
            })
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            
    return results

if __name__ == "__main__":
    target_dir = r"c:\Users\shingo_kosaka.ARGOGRAPHICS\Desktop\GlobalMacroSignal\GlobalMacroSignal\frontend\data\wiki_heavy"
    audit_results = audit_wiki_heavy(target_dir)
    
    # Save to CSV
    output_file = "wiki_audit_report.csv"
    keys = audit_results[0].keys() if audit_results else []
    with open(output_file, 'w', newline='', encoding='utf-8-sig') as f:
        dict_writer = csv.DictWriter(f, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(audit_results)
    
    print(f"Audit complete. Results saved to {output_file}")
    
    # Summary of German locale specifically
    de_issues = [r for r in audit_results if r['lang'] == 'DE' and (r['is_under_1500'] or not r['has_6_experts'])]
    print(f"\nGerman Locale Issues ({len(de_issues)} files):")
    for r in de_issues:
        print(f"- {r['filename']}: Chars={r['char_count']}, Experts={r['expert_count']}")
