import json
import re
import os
import sys

def heal_file(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return False
    
    print(f"Processing {path}...")
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Remove merge markers - favoring Upstream or Stashed based on content
        # This regex removes the headers and keeps the most recent looking part or just pulls out JSON blocks
        
        # Strategy: find all JSON-like objects and reconstruct
        # But first, simple search and replace for markers if they are simple
        content = re.sub(r'<<<<<<<.*?=======', '', content, flags=re.DOTALL)
        content = re.sub(r'>>>>>>>.*?\n', '', content)
        content = re.sub(r'=======.*?>>>>>>>', '', content, flags=re.DOTALL)
        
        # Try to parse the resulting content
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            # If that failed, fall back to a more aggressive approach: find the first { and last }
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                try:
                    data = json.loads(match.group(0))
                except:
                    print(f"Fatal corruption in {path}")
                    return False
            else:
                print(f"No JSON object found in {path}")
                return False

        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        print(f"Successfully healed {path}")
        return True
    except Exception as e:
        print(f"Error healing {path}: {e}")
        return False

if __name__ == "__main__":
    files_to_heal = [
        'frontend/public/data/market_data.json',
        'frontend/public/data/current_signal.json',
        'frontend/public/data/market_analysis.json'
    ]
    for f in files_to_heal:
        heal_file(f)
