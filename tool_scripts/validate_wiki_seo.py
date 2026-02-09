import os
import json
import re

WIKI_DIR = r"c:\Users\shingo_kosaka.ARGOGRAPHICS\Desktop\GlobalMacroSignal\frontend\data\wiki_heavy"

def validate_file(filepath):
    filename = os.path.basename(filepath)
    errors = []
    warnings = []
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        return [f"CRITICAL: Invalid JSON Syntax: {e}"], []
    except Exception as e:
        return [f"CRITICAL: Could not read file: {e}"], []

    if not isinstance(data, dict):
        return [f"CRITICAL: Root element is not a dictionary (got {type(data)})"], []


    # 1. Filename Parsing
    # Expected format: slug-lang.json
    match = re.match(r"^(.*)-(en|de|fr|es|cn|jp|hi|ar|id|ru|pt)\.json$", filename)
    if not match:
        errors.append(f"Filename invalid format: {filename}")
        slug_from_filename = ""
        lang_from_filename = ""
    else:
        slug_from_filename = match.group(1)
        lang_from_filename = match.group(2).upper()

    # 2. Required Fields
    required_fields = ["slug", "lang", "title", "type", "category", "sections"]
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")

    # 3. Consistency Checks
    if slug_from_filename:
        if data.get("slug") != slug_from_filename:
            errors.append(f"Slug mismatch: Filename '{slug_from_filename}' vs Content '{data.get('slug')}'")
    
    if lang_from_filename:
        if data.get("lang") != lang_from_filename:
            errors.append(f"Language mismatch: Filename '{lang_from_filename}' vs Content '{data.get('lang')}'")

    # 4. SEO & Content Quality Checks
    title = data.get("title", "")
    if len(title) < 5:
        warnings.append(f"Title too short (<5 chars): '{title}'")
    if len(title) > 70:
        warnings.append(f"Title potentially too long for SEO (>70 chars): '{title}'")

    summary = data.get("sections", {}).get("summary", "")
    if len(summary) < 50:
        warnings.append("Summary too short (<50 chars) - poor for SEO/User")
    
    deep_dive = data.get("sections", {}).get("deep_dive", "")
    if not deep_dive or len(deep_dive) < 100:
        warnings.append("Deep Dive content missing or too short")

    return errors, warnings

import sys

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    print(f"Scanning directory: {WIKI_DIR}")
    # Filter only DE and FR files for verification of recent work
    files = [f for f in os.listdir(WIKI_DIR) if f.endswith("-de.json") or f.endswith("-fr.json")]
    
    total_files = len(files)
    invalid_files = 0
    files_with_warnings = 0
    
    for filename in files:
        filepath = os.path.join(WIKI_DIR, filename)
        errors, warnings = validate_file(filepath)
        
        if errors or warnings:
            print(f"\n--- {filename} ---")
            for err in errors:
                print(f"  [ERROR] {err}")
            for warn in warnings:
                print(f"  [WARN]  {warn}")
            
            if errors:
                invalid_files += 1
            if warnings and not errors:
                files_with_warnings += 1

    print("\n" + "="*30)
    print("VALIDATION SUMMARY")
    print(f"Total Files Scanned: {total_files}")
    print(f"Files with Errors: {invalid_files}")
    print(f"Files with Warnings: {files_with_warnings}")
    print(f"Clean Files: {total_files - invalid_files - files_with_warnings}")
    print("="*30)

if __name__ == "__main__":
    main()
