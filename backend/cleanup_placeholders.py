import os
import json

DATA_DIR = r"c:\Users\shingo_kosaka.ARGOGRAPHICS\Desktop\GlobalMacroSignal\GlobalMacroSignal\frontend\data\wiki_heavy"
RESULTS_FILE = "audit_results.json"

def cleanup():
    if not os.path.exists(RESULTS_FILE):
        print("No audit results found.")
        return

    with open(RESULTS_FILE, "r", encoding="utf-8") as f:
        results = json.load(f)

    deleted_count = 0
    for r in results:
        fpath = os.path.join(DATA_DIR, r["file"])
        if os.path.exists(fpath):
            try:
                # --- QUALITY GUARD (V4.9) ---
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()
                    # Do not delete if expert signatures are detected
                    if "Antigravity-GMS-v1" in content or "geographical neutral reserve asset" in content:
                        print(f"  [GUARD] Skipping {fpath} (Expert-curated content detected)")
                        continue
                # ----------------------------
                os.remove(fpath)
                deleted_count += 1
            except Exception as e:
                print(f"Error deleting {fpath}: {e}")
    
    # Also clear them from progress.json if they exist
    PROGRESS_FILE = os.path.join(DATA_DIR, "progress.json")
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            progress = json.load(f)
        
        # task_id is f"{slug}-{lang}"
        ids_to_remove = {f"{r['slug']}-{r['lang']}" for r in results}
        new_progress = [p for p in progress if p not in ids_to_remove]
        
        with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
            json.dump(new_progress, f)

    print(f"Deleted {deleted_count} placeholder files and updated progress.json.")

if __name__ == "__main__":
    cleanup()
