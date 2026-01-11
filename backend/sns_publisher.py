import json
import os
import sys
from datetime import datetime

# CONFIGURATION
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "current_signal.json")

# MOCK API CLIENTS (Placeholder for future Twipy/Bluesky integration)
class MockTwitter:
    def post(self, text):
        print(f"\n[TWITTER] Posting:\n{text}\n{'-'*20}")
        return True

class MockBluesky:
    def post(self, text):
        print(f"\n[BLUESKY] Posting:\n{text}\n{'-'*20}")
        return True

def load_data():
    if not os.path.exists(DATA_FILE):
        print("Error: Signal data file not found.")
        return None
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def format_posts(data):
    """
    Generates FACT-BASED posts in multiple languages.
    Strictly NO ADVICE. "Data only."
    """
    score = data.get("gms_score", 50)
    market = data.get("market_data", {})
    
    # Extract Key Metrics
    vix = market.get("VIX", {}).get("price", "N/A")
    tnx = market.get("TNX", {}).get("price", "N/A") # 10Y Yield
    hy = market.get("HY_SPREAD", {}).get("price", "N/A")
    
    # Determine Status Icon
    if score > 60: icon = "🟢" # Risk On
    elif score < 40: icon = "🔴" # Risk Off
    else: icon = "🟡" # Neutral

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M EST")

    # Disclaimer Strings (MANDATORY)
    disclaimer_en = "Data provided for informational purposes only. Not financial advice."
    disclaimer_jp = "本情報は参照用データであり、投資助言ではありません。"
    
    # 1. English Post
    post_en = f"""{icon} GMS SIGNAL: {score}/100
    
[LIVE DATA] {timestamp}
• VIX: {vix}
• US 10Y: {tnx}%
• HY Spread: {hy}%

#OmniMetric #Macro #Finance
{disclaimer_en}"""

    # 2. Japanese Post
    post_jp = f"""{icon} GMS市場スコア: {score}/100
    
【最新データ】 {timestamp}
• VIX指数: {vix}
• 米10年債: {tnx}%
• HYスプレッド: {hy}%

#OmniMetric #米国株 #投資
{disclaimer_jp}"""

    return [post_en, post_jp]

def main():
    print("--- OMNIMETRIC SNS AUTOMATION (DRY RUN) ---")
    data = load_data()
    if not data: return

    posts = format_posts(data)
    
    # Initialize Clients (Mock for now)
    twitter = MockTwitter()
    bluesky = MockBluesky()

    for post in posts:
        # Dry Run safe guard
        # if os.getenv("SNS_LIVE") == "TRUE": ...
        twitter.post(post)
        bluesky.post(post)

    print("--- END OF TRANSMISSION ---")

if __name__ == "__main__":
    main()
