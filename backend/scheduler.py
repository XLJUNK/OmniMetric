import os
import sys
import schedule
import time
from gms_engine import update_signal
from datetime import datetime

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
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Scheduler triggered: Updating GMS Signal...")
    update_signal()

def run_scheduler():
    check_pid()
    print("GMS Scheduler System Initialized.")
    print("Targeting: Hourly Updates + Market Closes (Tok/Lon/NY).")
    
    # Run immediately on startup
    job()
    
    # Schedule hourly updates
    schedule.every(1).hours.do(job)
    
    # Market Closes (Approximate JST, can be refined)
    # Tokyo Close: 15:00 JST
    schedule.every().day.at("15:00").do(job)
    # London Close: 01:30 JST (variable) - Simplified to 01:30
    schedule.every().day.at("01:30").do(job)
    # NY Close: 06:00 JST (variable) - Simplified to 06:00
    schedule.every().day.at("06:00").do(job)
    
    while True:
        try:
            schedule.run_pending()
        except Exception as e:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Scheduler Error: {e}")
        time.sleep(60)

if __name__ == "__main__":
    try:
        run_scheduler()
    except KeyboardInterrupt:
        print("Scheduler stopped by user.")
