import json
import os

def sanitize_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 1. Sanitize 'content'
        c = data.get('analysis', {}).get('content')
        if isinstance(c, dict):
            parts = [
                c.get('GMS', ''),
                c.get('Analysis', ''),
                c.get('Breaking News Impact', '')
            ]
            data['analysis']['content'] = " ".join([p for p in parts if p]).strip()
            print(f"Sanitized 'content' in {filepath}")

        # 2. Sanitize 'reports'
        reps = data.get('analysis', {}).get('reports', {})
        new_reps = {}
        for lang, val in reps.items():
            if isinstance(val, dict):
                parts = [
                    val.get('GMS', ''),
                    val.get('Analysis', ''),
                    val.get('Breaking News Impact', ''),
                    val.get('News impact', ''),
                    val.get('impact', '')
                ]
                new_reps[lang] = " ".join([p for p in parts if p]).strip()
            else:
                new_reps[lang] = val
        
        if reps:
            data['analysis']['reports'] = new_reps
            print(f"Sanitized 'reports' in {filepath}")

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        
        print(f"Successfully updated {filepath}")

    except Exception as e:
        print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    sanitize_file('backend/archive/2026-01-13.json')
    sanitize_file('backend/current_signal.json')
