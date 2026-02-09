import os
import json

def check_parity():
    directory = "frontend/data/wiki_heavy"
    langs = ["en", "de", "fr", "jp", "cn", "ar", "es", "hi", "id"]
    
    # Map to store slugs per language
    slugs_by_lang = {l: set() for l in langs}
    
    files = [f for f in os.listdir(directory) if f.endswith(".json")]
    
    for filename in files:
        # Expected format: slug-lang.json
        parts = filename.replace(".json", "").split("-")
        if len(parts) > 1:
            lang = parts[-1]
            slug = "-".join(parts[:-1])
            if lang in slugs_by_lang:
                slugs_by_lang[lang].add(slug)
    
    # Use EN as the baseline
    baseline = slugs_by_lang["en"]
    total_baseline = len(baseline)
    
    report = {
        "summary": {},
        "missing": {}
    }
    
    for lang in langs:
        if lang == "en":
            report["summary"][lang] = {
                "total": len(slugs_by_lang[lang]),
                "coverage_pct": 100.0,
                "missing_count": 0
            }
            continue
            
        current = slugs_by_lang[lang]
        missing = baseline - current
        count_missing = len(missing)
        coverage = ((total_baseline - count_missing) / total_baseline) * 100 if total_baseline > 0 else 0
        
        report["summary"][lang] = {
            "total": len(current),
            "coverage_pct": round(coverage, 2),
            "missing_count": count_missing
        }
        report["missing"][lang] = sorted(list(missing))
        
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    check_parity()
