import os
import sys
import schedule
import time
from gms_engine import update_signal
from datetime import datetime, timezone

PID_FILE = "scheduler.pid"

def check_pid():
    if os.path.exists(PID_FILE):
        try:
            with open(PID_FILE, 'r') as f:
                old_pid = int(f.read().strip())
            # Check if process actually exists
            import psutil
            if psutil.pid_exists(old_pid):
                print(f"[FATAL] Scheduler already running (PID: {old_pid}). Exiting.")
                sys.exit(1)
        except (ValueError, ImportError):
            pass
    # Write current PID
    with open(PID_FILE, 'w') as f:
        f.write(str(os.getpid()))

def job():
    print(f"[{datetime.now(timezone.utc).strftime('%H:%M:%S')}] Scheduler triggered: Updating GMS Signal...")
    update_signal()

def run_scheduler():
    check_pid()
    print("--- [SYSTEM] OMNIMETRIC SCHEDULER INITIALIZED ---")
    print("Update Frequency: Every 10 Minutes")
    print("Phase: Real-Time Market Monitoring")
    
    # Run immediately on startup
    job()
    
    # Schedule updates every 10 minutes (Market Data only)
    schedule.every(10).minutes.do(job)
    
    # News-intensive updates (at 05 and 35 mins)
    schedule.every().hour.at(":05").do(lambda: update_signal(force_news=True))
    schedule.every().hour.at(":35").do(lambda: update_signal(force_news=True))
    
    # Explicit Market Closes (Ensuring captures at key session breaks)
    schedule.every().day.at("15:05").do(job) # Tokyo Close + buffer
    schedule.every().day.at("01:35").do(job) # London Close + buffer
    schedule.every().day.at("06:05").do(job) # NY Close + buffer
    
    while True:
        try:
            schedule.run_pending()
        except Exception as e:
            print(f"[{datetime.now(timezone.utc).strftime('%H:%M:%S')}] Scheduler Error: {e}")
        time.sleep(60)

if __name__ == "__main__":
    try:
        run_scheduler()
    except KeyboardInterrupt:
        print("Scheduler stopped by user.")
