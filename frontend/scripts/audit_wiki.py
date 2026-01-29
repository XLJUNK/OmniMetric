
import json
import os
import re
from collections import defaultdict

# Paths
base_dir = r"c:\Users\shingo_kosaka.ARGOGRAPHICS\Desktop\GlobalMacroSignal\frontend\data"
wiki_heavy_dir = os.path.join(base_dir, "wiki_heavy")
maxims_path = os.path.join(base_dir, "maxims-en.json")
technical_path = os.path.join(base_dir, "technical-en.json")
glossary_path = os.path.join(base_dir, "glossary-en.json")

def slugify(text):
    text = text.lower()
    text = text.replace('/', '-') # Handle slash
    text = re.sub(r'[^\w\s-]', '', text) 
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

def load_slugs(path, type_):
    slugs = []
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            if type_ == 'maxims':
                for category in data:
                    if 'quotes' in category:
                        for quote in category['quotes']:
                            if 'id' in quote:
                                slugs.append(quote['id'])
                                
            elif type_ == 'technical':
                for category in data:
                    if 'indicators' in category:
                        for indicator in category['indicators']:
                            if 'name' in indicator:
                                slugs.append(slugify(indicator['name']))
                                
            elif type_ == 'glossary':
                 if isinstance(data, dict):
                     slugs = list(data.keys())
                 elif isinstance(data, list):
                     for item in data:
                         if 'term' in item: slugs.append(slugify(item['term']))
                         elif 'slug' in item: slugs.append(item['slug'])

    except Exception as e:
        print(f"Error loading {path}: {e}")
    return slugs

expected_slugs = set()
sources = {
    "Maxims": (maxims_path, 'maxims'),
    "Technical": (technical_path, 'technical'),
    "Glossary": (glossary_path, 'glossary'),
}

for name, (path, type_) in sources.items():
    slugs = load_slugs(path, type_)
    for s in slugs:
        expected_slugs.add(s)

actual_files = os.listdir(wiki_heavy_dir)
actual_slugs = defaultdict(set)

for f in actual_files:
    if not f.endswith('.json'): continue
    parts = f.replace('.json', '').split('-')
    lang = parts[-1] 
    if len(lang) == 2: # heuristic
        slug = "-".join(parts[:-1])
        actual_slugs[slug].add(lang)


missing_topics = sorted(list(expected_slugs - set(actual_slugs.keys())))
extra_topics = sorted(list(set(actual_slugs.keys()) - expected_slugs))

print(f"MISSING ({len(missing_topics)}):")
for t in missing_topics:
    print(t)

print(f"\nEXTRA ({len(extra_topics)}):")
for t in extra_topics:
    print(t)
