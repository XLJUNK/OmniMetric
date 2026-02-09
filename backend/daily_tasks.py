import os
import sys
import json
import logging
from datetime import datetime, timezone
<<<<<<< HEAD
import update_ogv_beacons
=======
# import update_ogv_beacons # Removed to avoid import error if missing
>>>>>>> origin/main
from utils.file_ops import safe_json_merge

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DATA_DIR = os.path.join(SCRIPT_DIR, "../frontend/public/data")
DATA_FILE = os.path.join(SCRIPT_DIR, "current_signal.json")
FRONTEND_MARKET_DATA_FILE = os.path.join(FRONTEND_DATA_DIR, "market_data.json")
ARCHIVE_DIR = os.path.join(SCRIPT_DIR, "archive")
FRONTEND_ARCHIVE_DIR = os.path.join(FRONTEND_DATA_DIR, "archive")

def setup_logger():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - [DAILY] - %(message)s')
    return logging.getLogger("daily_tasks")

logger = setup_logger()

def update_archive_index():
    try:
        if not os.path.exists(FRONTEND_ARCHIVE_DIR):
            os.makedirs(FRONTEND_ARCHIVE_DIR, exist_ok=True)
            
        files = sorted([f for f in os.listdir(FRONTEND_ARCHIVE_DIR) if f.endswith('.json') and f != 'index.json'], reverse=True)
        dates = [f.replace('.json', '') for f in files]
        index_path = os.path.join(FRONTEND_ARCHIVE_DIR, "index.json")
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump({"dates": dates, "last_updated": datetime.now(timezone.utc).isoformat()}, f)
        logger.info(f"Updated archive index: {index_path}")
    except Exception as e:
        logger.error(f"Failed to update index: {e}")

def run_archive():
    logger.info("Starting Daily Archive...")
    today_str = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    archive_path = os.path.join(ARCHIVE_DIR, f"{today_str}.json")
    frontend_archive_path = os.path.join(FRONTEND_ARCHIVE_DIR, f"{today_str}.json")
    
    # Ensure dirs
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    os.makedirs(FRONTEND_ARCHIVE_DIR, exist_ok=True)
    
    # Load current data
    if not os.path.exists(DATA_FILE):
        logger.warning(f"No data file found at {DATA_FILE} to archive.")
        return

    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        archive_payload = {
            "date": today_str,
            "gms_score": data.get("gms_score"),
            "market_data": data.get("market_data"), # Stores snapshots of market data
            "analysis": data.get("analysis"),
            "last_updated": data.get("last_updated")
        }
        
        # Save Backend Archive
        with open(archive_path, 'w', encoding='utf-8') as f:
            json.dump(archive_payload, f, indent=4, ensure_ascii=False)
            
        # Save Frontend Archive
        with open(frontend_archive_path, 'w', encoding='utf-8') as f:
            json.dump(archive_payload, f, indent=4, ensure_ascii=False)
            
        logger.info(f"Archived to {archive_path}")
        update_archive_index()
        
    except Exception as e:
        logger.error(f"Archive failed: {e}")

def run_ogv_update():
    logger.info("Starting OGV Moving Fortress Update...")
    try:
<<<<<<< HEAD
        # Run the existing OGV logic
        # We invoke the main function of update_ogv_beacons directly or via subprocess?
        # Direct import is better if refactored, but subprocess ensures clean env.
        # Let's import it as a module for now, assuming it has a 'run_update' or 'main' we can call.
        # Looking at update_ogv_beacons.py, it has a main() block.
        # We can just call main() logic.
        
        # ACTUALLY: The user wanted OGV logic moved here.
        # But `update_ogv_beacons.py` is already a dedicated script for this!
        # So `daily_tasks.py` is essentially a wrapper that calls `update_ogv_beacons` AND `archiving`.
        
        # Let's call the script via subprocess to keep it isolated and safe
        import subprocess
        result = subprocess.run([sys.executable, os.path.join(SCRIPT_DIR, "update_ogv_beacons.py")], capture_output=True, text=True)
=======
        ogv_script = os.path.join(SCRIPT_DIR, "update_ogv_beacons.py")
        if not os.path.exists(ogv_script):
             logger.warning(f"OGV Script not found at {ogv_script}. Skipping OGV update.")
             return

        import subprocess
        result = subprocess.run([sys.executable, ogv_script], capture_output=True, text=True)
>>>>>>> origin/main
        if result.returncode == 0:
            logger.info("OGV Update Success")
            logger.info(result.stdout)
        else:
            logger.error(f"OGV Update Failed: {result.stderr}")
            
    except Exception as e:
        logger.error(f"OGV wrapper loading failed: {e}")

def main():
    logger.info("=== DAILY MAINTENANCE TASKS START ===")
    
    # 1. OGV Update (Heavy)
    run_ogv_update()
    
    # 2. Archive (Snapshot)
    run_archive()
    
    logger.info("=== DAILY MAINTENANCE TASKS COMPLETE ===")

if __name__ == "__main__":
    main()
