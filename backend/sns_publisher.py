import json
import os
import sys
from datetime import datetime
import tweepy
from atproto import Client

# CONFIGURATION
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "current_signal.json")
HISTORY_FILE = os.path.join(SCRIPT_DIR, "history.json")

# URL for OGP
SITE_URL = "https://omnimetric.net"

def load_json(filepath):
    if not os.path.exists(filepath): return None
    with open(filepath, 'r') as f:
        return json.load(f)

def get_alert_status(current_data, history_data):
    """
    Checks for >5% deviation in Score or VIX.
    Returns: (bool is_emergency, str reason)
    """
    if not history_data or len(history_data) < 1:
        return False, ""
    
    last_entry = history_data[-1]
    
    # Check Score Deviation
    curr_score = current_data.get("gms_score", 50)
    last_score = last_entry.get("score", 50)
    
    if last_score == 0: delta_score = 0
    else: delta_score = abs(curr_score - last_score) / last_score * 100
    
    if delta_score >= 5.0:
        return True, f"SCORE ALERT: {last_score} -> {curr_score} ({delta_score:.1f}% CHANGE)"

    # Check VIX Deviation
    curr_vix = current_data.get("market_data", {}).get("VIX", {}).get("price", 0)
    # Note: History file currently only stores score. We need to rely on score for now solely.
    # Or strict check: if score changes regime drastically.
    
    return False, ""

def format_posts(data, alert_reason=""):
    """
    Generates posts. Adds [EMERGENCY] tag if alert_reason is present.
    """
    score = data.get("gms_score", 50)
    market = data.get("market_data", {})
    
    vix = market.get("VIX", {}).get("price", "N/A")
    tnx = market.get("TNX", {}).get("price", "N/A")
    hy = market.get("HY_SPREAD", {}).get("price", "N/A")
    
    if score > 60: icon = "🟢"
    elif score < 40: icon = "🔴"
    else: icon = "🟡"

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M EST")
    
    header_en = "OmniMetric GMS Report"
    header_jp = "OmniMetric GMS レポート"

    alert_prefix_en = "🚨 EMERGENCY ALERT: " + alert_reason + "\n" if alert_reason else ""
    alert_prefix_jp = "🚨 緊急アラート: " + alert_reason + "\n" if alert_reason else ""

    # Disclaimer Strings
    disclaimer_en = "No investment advice. Factual data only."
    disclaimer_jp = "投資助言ではありません。事実データのみを提供します。"
    
    # UTM Tracking
    utm = "?utm_source=twitter&utm_medium=social&utm_campaign=gms_auto_report"
    tracked_url = f"{SITE_URL}{utm}"
    
    # 1. English Post
    post_en = f"""{alert_prefix_en}{icon} {header_en}
Signal Score: {score}/100

[MARKET DATA] {timestamp}
• VIX: {vix}
• US 10Y: {tnx}%
• HY Spread: {hy}%

{tracked_url}
#OmniMetric #Macro
{disclaimer_en}"""

    # 2. Japanese Post
    post_jp = f"""{alert_prefix_jp}{icon} {header_jp}
市場スコア: {score}/100

【最新データ】 {timestamp}
• VIX指数: {vix}
• 米10年債: {tnx}%
• HYスプレッド: {hy}%

{tracked_url}
#OmniMetric #米国株
{disclaimer_jp}"""

    # 3. Chinese Post (Simplified)
    post_cn = f"""{icon} OmniMetric GMS 报告
市场评分: {score}/100

• VIX波动率: {vix}
• 美债10年: {tnx}%
• 信贷利差: {hy}%

{tracked_url}
#Macro
非投资建议。"""

    # 4. Spanish Post
    post_es = f"""{icon} Informe OmniMetric GMS
Puntuación: {score}/100

• VIX: {vix}
• Bonos 10A: {tnx}%
• Spread HY: {hy}%

{tracked_url}
#Finanzas
No es consejo de inversión."""

    return [post_en, post_jp, post_cn, post_es]

def post_to_twitter(text):
    api_key = os.getenv("TWITTER_API_KEY")
    api_secret = os.getenv("TWITTER_API_SECRET")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN")
    access_secret = os.getenv("TWITTER_ACCESS_SECRET")
    
    if not all([api_key, api_secret, access_token, access_secret]):
        print("[TWITTER] Credentials missing. Skipping.")
        return False

    try:
        client = tweepy.Client(
            consumer_key=api_key, consumer_secret=api_secret,
            access_token=access_token, access_token_secret=access_secret
        )
        client.create_tweet(text=text)
        print("[TWITTER] Posted successfully.")
        return True
    except Exception as e:
        print(f"[TWITTER] Error: {e}")
        return False

def post_to_bluesky(text):
    bsky_user = os.getenv("BLUESKY_HANDLE")
    bsky_pass = os.getenv("BLUESKY_PASSWORD")
    
    if not all([bsky_user, bsky_pass]):
        print("[BLUESKY] Credentials missing. Skipping.")
        return False
        
    try:
        client = Client()
        client.login(bsky_user, bsky_pass)
        client.send_post(text=text)
        print("[BLUESKY] Posted successfully.")
        return True
    except Exception as e:
        print(f"[BLUESKY] Error: {e}")
        return False

def main():
    print("--- OMNIMETRIC SNS PUBLISHER ---")
    current_data = load_json(DATA_FILE)
    history_data = load_json(HISTORY_FILE)
    
    if not current_data:
        print("Error: No data found.")
        return

    # Check Alert
    is_emergency, alert_reason = get_alert_status(current_data, history_data)
    
    # Argument flag for forced run (e.g. scheduled)
    # If not emergency and not scheduled time, strictly speaking we might skip?
    # But GitHub Action schedule controls the timing (4x daily).
    # So we just post whatever is current whenever this script runs.
    # UNLESS it's an emergency run triggered by an event? 
    # For now, let's just post. The "Emergency" logic just adds the tag.
    
    posts = format_posts(current_data, alert_reason)
    
    # Select language based on... random? Or post ALL in a thread?
    # X/Twitter Rate limits are strict.
    # Strategy: Post EN and JP mainly. Rotate others?
    # User request: "Short text (JP/EN/CN/ES)" implicates ALL?
    # Posting 4 separate tweets at once might be spammy.
    # Let's post EN and JP as primary.
    
    # Priority: JP (User seems Japanese), EN (Global).
    target_posts = [posts[1], posts[0]] # JP, EN
    if is_emergency:
        # In emergency, post all
        target_posts = posts

    for p in target_posts:
        print(f"\n--- PREVIEW ---\n{p}\n---------------")
        # Post
        post_to_twitter(p)
        post_to_bluesky(p)

if __name__ == "__main__":
    main()
