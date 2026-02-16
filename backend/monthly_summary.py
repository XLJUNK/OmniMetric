import os
import json
import sys
import time
import subprocess
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

# Path Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ARCHIVE_DIR = os.path.join(SCRIPT_DIR, "archive")
FRONTEND_DATA_DIR = os.path.join(SCRIPT_DIR, "../frontend/public/data")
FRONTEND_ARCHIVE_DIR = os.path.join(FRONTEND_DATA_DIR, "archive")
FRONTEND_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "frontend")
BRIDGE_SCRIPT = os.path.join(FRONTEND_DIR, "scripts", "generate_insight.ts")

# Ensure directories exist
os.makedirs(ARCHIVE_DIR, exist_ok=True)
os.makedirs(FRONTEND_ARCHIVE_DIR, exist_ok=True)

load_dotenv()

def get_previous_month_dates():
    now = datetime.now(timezone.utc)
    # First day of current month
    first_day_current = now.replace(day=1)
    # Last day of previous month
    last_day_prev = first_day_current - timedelta(days=1)
    # First day of previous month
    first_day_prev = last_day_prev.replace(day=1)
    return first_day_prev, last_day_prev

def load_month_data(start_date, end_date):
    data_list = []
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        file_path = os.path.join(ARCHIVE_DIR, f"{date_str}.json")
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    data_list.append(json.load(f))
                except: pass
        current_date += timedelta(days=1)
    return data_list

def generate_monthly_summary(month_data, start_date):
    if not month_data:
        print("[WARN] No data found for the previous month.")
        return None

    # Aggregate key stats
    scores = [d.get("gms_score", 50) for d in month_data if d.get("gms_score") is not None]
    if not scores: return None
    
    avg_score = sum(scores) / len(scores)
    max_score = max(scores)
    min_score = min(scores)
    
    start_score = scores[0]
    end_score = scores[-1]
    trend = "Improved" if end_score > start_score else "Decline" if end_score < start_score else "Stable"

    month_name = start_date.strftime("%B %Y")
    
    # Prompt for AI
    prompt = f"""
【Archive Intelligence Protocol v1.0: Monthly Synopsis】
You are the historical archiver for OmniMetric. Analyze the provided macro data for the entire month of {month_name} and generate a comprehensive "Monthly Macro Intelligence Summary".

### DATA SUMMARY:
- Period: {month_name}
- Average GMS Score: {avg_score:.1f}/100
- Peak Score: {max_score}
- Trough Score: {min_score}
- Monthly Trend: {trend} (Start: {start_score} -> End: {end_score})

### REQUIREMENTS:
1. **Style**: Institutional, authoritative, and reflective. Identify the defining "Macro Theme" of the month.
2. **Structure**: 
   - Paragraph 1: Executive Summary & Regime Review.
   - Paragraph 2: Core Asset Performance Correlation.
   - Paragraph 3: Outlook for the coming month based on historical trajectory.
3. **Format**: Single fluent paragraph of high-level analysis.
4. **Max Length**: 1000 characters per language.

Output JSON format (Keep consistent across languages):
{{
  "JP": "...", "EN": "...", "CN": "...", "ES": "...",
  "HI": "...", "ID": "...", "AR": "...", "DE": "...", "FR": "..."
}}
"""
    # AI Generation (Using Bridge)
    import shutil
    if not shutil.which("npx"):
        print("[ERROR] npx not found. Skipping Bridge.")
        return None

    try:
        cmd = ["npx", "tsx", BRIDGE_SCRIPT]
        print(f"[AI BRIDGE] Executing: {' '.join(cmd)}")
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            shell=(os.name == 'nt'),
            cwd=FRONTEND_DIR
        )
        stdout, stderr = process.communicate(input=prompt, timeout=180)
        
        if process.returncode == 0:
            json_start = stdout.find('{')
            json_end = stdout.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                final_json = stdout[json_start:json_end]
                wrapper = json.loads(final_json)
                if "text" in wrapper:
                    inner_text = wrapper["text"]
                    if "```json" in inner_text:
                        inner_text = inner_text.split("```json")[1].split("```")[0].strip()
                    elif "```" in inner_text:
                        inner_text = inner_text.split("```")[1].split("```")[0].strip()
                    return json.loads(inner_text)
        else:
            print(f"[AI ERROR] Bridge failed: {stderr}")
    except Exception as e:
        print(f"[AI EXCEPTION] {e}")
    
    return None

def update_monthly_index():
    try:
        files = sorted([f for f in os.listdir(FRONTEND_ARCHIVE_DIR) if f.startswith('summary_') and f.endswith('.json')], reverse=True)
        months = [f.replace('summary_', '').replace('.json', '') for f in files]
        index_path = os.path.join(FRONTEND_ARCHIVE_DIR, "monthly_index.json")
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump({"months": months, "last_updated": datetime.now(timezone.utc).isoformat()}, f)
        print(f"Updated monthly index: {index_path}")
    except Exception as e:
        print(f"Failed to update monthly index: {e}")

def main():
    print("--- OmniMetric Monthly Summary Engine ---")
    start_date, end_date = get_previous_month_dates()
    month_key = start_date.strftime("%Y-%m")
    
    filename = f"summary_{month_key}.json"
    archive_path = os.path.join(ARCHIVE_DIR, filename)
    frontend_path = os.path.join(FRONTEND_ARCHIVE_DIR, filename)
    
    if os.path.exists(archive_path):
        print(f"[INFO] Summary for {month_key} already exists. Skipping.")
        return

    month_data = load_month_data(start_date, end_date)
    if not month_data:
        print(f"[ERROR] No data found for {month_key}.")
        return

    ai_reports = generate_monthly_summary(month_data, start_date)
    
    if ai_reports:
        payload = {
            "month": month_key,
            "title": f"Macro Intelligence Summary: {start_date.strftime('%B %Y')}",
            "reports": ai_reports,
            "stats": {
                "avg_score": round(sum([d.get("gms_score", 50) for d in month_data if d.get("gms_score") is not None]) / len(month_data), 1),
                "max_score": max([d.get("gms_score", 50) for d in month_data if d.get("gms_score") is not None]),
                "min_score": min([d.get("gms_score", 50) for d in month_data if d.get("gms_score") is not None]),
                "data_points": len(month_data)
            },
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Save to both locations
        with open(archive_path, 'w', encoding='utf-8') as f:
            json.dump(payload, f, indent=4, ensure_ascii=False)
        with open(frontend_path, 'w', encoding='utf-8') as f:
            json.dump(payload, f, indent=4, ensure_ascii=False)
            
        print(f"Saved monthly summary: {filename}")
        update_monthly_index()
    else:
        print("[FAIL] Failed to generate AI reports.")

if __name__ == "__main__":
    main()
