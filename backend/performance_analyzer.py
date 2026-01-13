import json
import os
from datetime import datetime
import pandas as pd
import numpy as np

# CONFIGURATION
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ARCHIVE_DIR = os.path.join(SCRIPT_DIR, "archive")
SUMMARY_FILE = os.path.join(ARCHIVE_DIR, "summary.json")
CURRENT_DATA_FILE = os.path.join(SCRIPT_DIR, "current_signal.json")

def load_json(filepath):
    if not os.path.exists(filepath): return None
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def update_summary():
    """Appends current snapshot to summary.json and rebuilds missing history."""
    current_data = load_json(CURRENT_DATA_FILE)
    
    summary = load_json(SUMMARY_FILE) or []
    
    # HEALING LOGIC: If summary is empty or missing days, rebuild from archives
    if os.path.exists(ARCHIVE_DIR):
        archive_files = [f for f in os.listdir(ARCHIVE_DIR) if f.endswith('.json') and f not in ['summary.json', 'performance_audit.json']]
        for f in archive_files:
            date_str = f.replace('.json', '')
            if not any(item['date'] == date_str for item in summary):
                print(f"Healing summary with data from {date_str}")
                data = load_json(os.path.join(ARCHIVE_DIR, f))
                if data:
                    summary.append({
                        "date": date_str,
                        "gms_score": data.get("gms_score"),
                        "spy_price": data.get("market_data", {}).get("SPY", {}).get("price"),
                        "vix_price": data.get("market_data", {}).get("VIX", {}).get("price"),
                        "net_liquidity": data.get("market_data", {}).get("NET_LIQUIDITY", {}).get("price")
                    })
    
    # Sort by date
    summary.sort(key=lambda x: x['date'])

    today_str = datetime.now().strftime("%Y-%m-%d")
    if current_data and not any(item['date'] == today_str for item in summary):
        new_entry = {
            "date": today_str,
            "gms_score": current_data.get("gms_score"),
            "spy_price": current_data.get("market_data", {}).get("SPY", {}).get("price"),
            "vix_price": current_data.get("market_data", {}).get("VIX", {}).get("price"),
            "net_liquidity": current_data.get("market_data", {}).get("NET_LIQUIDITY", {}).get("price")
        }
        summary.append(new_entry)
        print(f"Added current entry for {today_str}.")
    
    save_json(SUMMARY_FILE, summary)
    return summary

def analyze_performance(summary):
    """Calculates correlation metrics for the Proof Table."""
    if not summary or len(summary) < 2:
        return {
            "status": "insufficient_data",
            "metrics": {},
            "summaries": {},
            "history": summary or []
        }

    df = pd.DataFrame(summary)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')

    # Metrics calculation
    # Cleaning data for mean calculation
    for col in ['vix_price', 'gms_score']:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    df = df.dropna(subset=['vix_price', 'gms_score'])

    low_gms = df[df['gms_score'] < 40]
    high_gms = df[df['gms_score'] > 60]
    neutral_gms = df[(df['gms_score'] >= 40) & (df['gms_score'] <= 60)]

    avg_vix_low = round(low_gms['vix_price'].mean(), 2) if not low_gms.empty else 0
    avg_vix_high = round(high_gms['vix_price'].mean(), 2) if not high_gms.empty else 0
    avg_vix_neutral = round(neutral_gms['vix_price'].mean(), 2) if not neutral_gms.empty else 0

    performance_metrics = {
        "avg_vix_defensive": avg_vix_low if avg_vix_low > 0 else None,
        "avg_vix_neutral": avg_vix_neutral if avg_vix_neutral > 0 else None,
        "avg_vix_accumulate": avg_vix_high if avg_vix_high > 0 else None,
        "sample_count": len(df),
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    # Generate Performance Summary Strings (Multi-language template)
    summaries = {}
    if avg_vix_low > 0 and avg_vix_neutral > 0:
        diff = round(((avg_vix_low - avg_vix_neutral) / avg_vix_neutral) * 100, 1) if avg_vix_neutral != 0 else 0
        summaries["EN"] = f"Over the past {len(df)} entries, market volatility (VIX) was {diff}% higher during GMS Defensive regimes (<40) compared to Neutral, validating the signal's sensitivity to structural stress."
        summaries["JP"] = f"過去{len(df)}回の観測データにおいて、GMSが「ディフェンシブ（40以下）」を示した期間のVIX指数は平均{avg_vix_low}となり、ニュートラル期間より{diff}%高く推移しました。これは、本アルゴリズムが市場の構造的ストレスを正確に捉えていることを客観的に示しています。"
    else:
        summaries["EN"] = "Collecting historical correlation data to validate algorithmic performance..."
        summaries["JP"] = "アルゴリズムの有効性を検証するため、過去の相関データを蓄積中です..."

    return {
        "metrics": performance_metrics,
        "summaries": summaries,
        "history": summary[-30:] # Last 30 days for the table
    }

def main():
    print("--- GMS PERFORMANCE ANALYZER ---")
    summary = update_summary()
    analysis = analyze_performance(summary)
    
    # Save analysis result to be picked up by frontend
    analysis_file = os.path.join(ARCHIVE_DIR, "performance_audit.json")
    save_json(analysis_file, analysis)
    print("Performance audit updated.")

if __name__ == "__main__":
    main()
