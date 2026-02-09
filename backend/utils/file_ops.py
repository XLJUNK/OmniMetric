import json
import os
import time
from datetime import datetime, timezone
import shutil

def safe_json_merge(filepath, new_data, keys_to_preserve=None):
    """
    Safely merges new_data into an existing JSON file.
    
    Strategy:
    1. Read existing file immediately before writing (minimize race condition window).
    2. Overwrite existing keys with new_data.
    3. FORCE preservation of 'keys_to_preserve' from existing file if present.
    4. Write to temp file then atomic rename.
    """
    if keys_to_preserve is None:
        keys_to_preserve = []

    # 1. Load Existing (Critical Section Start)
    existing_data = {}
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        except Exception as e:
            print(f"[WARN] Failed to read {filepath} for merge: {e}")
            # Don't fail, start fresh but try to backup if corrupt
            if os.path.exists(filepath):
                try:
                    shutil.copy(filepath, filepath + ".bak")
                except: pass

    # 2. Prepare Final Data
    final_data = existing_data.copy()
    
    # 2a. Update with new data (new data takes precedence by default)
    # We do a deep merge for 'market_data' if possible, but for now simple update
    final_data.update(new_data)
    
    # 3. Force Preservation (Reverse priority for protected keys)
    # If the script calculates 'Score' but not 'OGV', and 'OGV' is in keys_to_preserve,
    # we ensure existing['OGV'] overwrites any potential 'None' or missing value in new_data
    for key in keys_to_preserve:
        if key in existing_data:
            # If new_data doesn't have it, or has it as None/Empty, assume we want the existing one
            # Actually, let's strictly enforce: IF it exists in disk, keep it, UNLESS new_data specifically explicitly updates it?
            # No, 'keys_to_preserve' implies "I don't own this data, so keep the old one".
            if key not in new_data or not new_data[key]: 
                 final_data[key] = existing_data[key]
            # Special case: If new_data HAS it (e.g. daily script updating OGV), we let it update.
            # But if Hourly script calls this with keys_to_preserve=['ogv'], it won't have 'ogv' in new_data, so it keeps existing.
            
    # 4. Write (Atomic)
    temp_path = filepath + ".tmp"
    try:
        with open(temp_path, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, indent=4, ensure_ascii=False)
        
        # Atomic rename
        shutil.move(temp_path, filepath)
        # print(f"[SUCCESS] Merged and saved to {filepath}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to save {filepath}: {e}")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return False
