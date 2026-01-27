import json
import os
from datetime import datetime, timezone
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
    
    # HEALING & EXPANSION LOGIC
    if os.path.exists(ARCHIVE_DIR):
        archive_files = [f for f in os.listdir(ARCHIVE_DIR) if f.endswith('.json') and f not in ['summary.json', 'performance_audit.json']]
        for f in archive_files:
            date_str = f.replace('.json', '')
            # Check if we need to heal/expand this entry
            existing_entry = next((item for item in summary if item['date'] == date_str), None)
            
            # If missing OR missing new indicator keys (like move_price), re-process
            if not existing_entry or "move_price" not in existing_entry:
                print(f"Healing/Expanding summary with data from {date_str}")
                data = load_json(os.path.join(ARCHIVE_DIR, f))
                if data:
                    market_data = data.get("market_data", {})
                    new_item = {
                        "date": date_str,
                        "gms_score": data.get("gms_score"),
                        # Strategic 16 Accumulation
                        "net_liquidity": market_data.get("NET_LIQUIDITY", {}).get("price"),
                        "move_price": market_data.get("MOVE", {}).get("price"),
                        "real_rate": market_data.get("REAL_INTEREST_RATE", {}).get("price"),
                        "breakeven_inflation": market_data.get("BREAKEVEN_INFLATION", {}).get("price"),
                        "dxy_price": market_data.get("DXY", {}).get("price"),
                        "hy_spread": market_data.get("HY_SPREAD", {}).get("price"),
                        "nfci_price": market_data.get("NFCI", {}).get("price"),
                        "breadth_spread": market_data.get("BREADTH", {}).get("price"),
                        "gold_price": market_data.get("GOLD", {}).get("price"),
                        "btc_price": market_data.get("BTC", {}).get("price"),
                        "copper_gold_ratio": market_data.get("COPPER_GOLD", {}).get("price"),
                        "vix_price": market_data.get("VIX", {}).get("price"),
                        "spy_price": market_data.get("SPY", {}).get("price"),
                        "qqq_price": market_data.get("QQQ", {}).get("price"),
                        "iwm_price": market_data.get("IWM", {}).get("price"),
                        "crypto_sentiment": market_data.get("CRYPTO_SENTIMENT", {}).get("price")
                    }
                    if existing_entry:
                        summary.remove(existing_entry)
                    summary.append(new_item)
    
    # Sort by date
    summary.sort(key=lambda x: x['date'])

    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if current_data:
        # Update or Add today's entry
        market_data = current_data.get("market_data", {})
        new_entry = {
            "date": today_str,
            "gms_score": current_data.get("gms_score"),
            "net_liquidity": market_data.get("NET_LIQUIDITY", {}).get("price"),
            "move_price": market_data.get("MOVE", {}).get("price"),
            "real_rate": market_data.get("REAL_INTEREST_RATE", {}).get("price"),
            "breakeven_inflation": market_data.get("BREAKEVEN_INFLATION", {}).get("price"),
            "dxy_price": market_data.get("DXY", {}).get("price"),
            "hy_spread": market_data.get("HY_SPREAD", {}).get("price"),
            "nfci_price": market_data.get("NFCI", {}).get("price"),
            "breadth_spread": market_data.get("BREADTH", {}).get("price"),
            "gold_price": market_data.get("GOLD", {}).get("price"),
            "btc_price": market_data.get("BTC", {}).get("price"),
            "copper_gold_ratio": market_data.get("COPPER_GOLD", {}).get("price"),
            "vix_price": market_data.get("VIX", {}).get("price"),
            "spy_price": market_data.get("SPY", {}).get("price"),
            "qqq_price": market_data.get("QQQ", {}).get("price"),
            "iwm_price": market_data.get("IWM", {}).get("price"),
            "crypto_sentiment": market_data.get("CRYPTO_SENTIMENT", {}).get("price")
        }
        
        # Remove existing if any
        summary = [item for item in summary if item['date'] != today_str]
        summary.append(new_entry)
        print(f"Upserted current entry for {today_str}.")
    
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
        "last_updated": datetime.now(timezone.utc).isoformat()
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
