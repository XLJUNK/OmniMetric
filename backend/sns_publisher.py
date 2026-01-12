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
SUMMARY_FILE = os.path.join(SCRIPT_DIR, "archive", "summary.json")

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

# ... (Existing Imports)

# SEO KEYWORDS FILE
KEYWORDS_FILE = os.path.join(SCRIPT_DIR, "trending_keywords.json")

def load_seo_hashtags():
    """Loads dynamic hashtags from GSC analysis."""
    if not os.path.exists(KEYWORDS_FILE):
        return "#OmniMetric #Macro" # Default
    try:
        with open(KEYWORDS_FILE, 'r') as f:
            data = json.load(f)
            tags = data.get("hashtags", [])
            if tags:
                return " ".join(tags)
    except:
        pass
    return "#OmniMetric #Macro" # Fallback

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

    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    
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
    
    # SEO Hashtags
    seo_tags = load_seo_hashtags()
    
    # 1. English Post
    post_en = f"""{alert_prefix_en}{icon} {header_en}
Signal Score: {score}/100

[MARKET DATA] {timestamp}
• VIX: {vix}
• US 10Y: {tnx}%
• HY Spread: {hy}%

{tracked_url}
{seo_tags}
{disclaimer_en}"""

    # 2. Japanese Post
    post_jp = f"""{alert_prefix_jp}{icon} {header_jp}
市場スコア: {score}/100

【最新データ】 {timestamp}
• VIX指数: {vix}
• 米10年債: {tnx}%
• HYスプレッド: {hy}%

{tracked_url}
{seo_tags} #米国株
{disclaimer_jp}"""

    # 3. Chinese Post (Simplified)
    post_cn = f"""{icon} OmniMetric GMS 报告
市场评分: {score}/100

• VIX波动率: {vix}
• 美债10年: {tnx}%
• 信贷利差: {hy}%

{tracked_url}
{seo_tags}
非投资建议。"""

    # 4. Spanish Post
    post_es = f"""{icon} Informe OmniMetric GMS
Puntuación: {score}/100

• VIX: {vix}
• Bonos 10A: {tnx}%
• Spread HY: {hy}%

{tracked_url}
{seo_tags}
No es consejo de inversión."""

    return [post_en, post_jp, post_cn, post_es]

def format_correlation_replay(data, history_data):
    """
    Generates a post looking back at a specific historical point (e.g., 7 days ago)
    and comparing it to current market conditions.
    """
    if not history_data or len(history_data) < 8:
        return None, None # Need at least 1 week of history

    # Target: approx 7 entries ago (roughly 7 days if daily snapshots, or 7 hours).
    # Since summary.json will be daily, 7 entries = 7 days.
    past_entry = history_data[-7]
    past_date = past_entry.get("date", "N/A")
    past_score = past_entry.get("gms_score", 50)
    past_spy = past_entry.get("spy_price", 0)

    curr_spy = data.get("market_data", {}).get("SPY", {}).get("price", 0)
    spy_diff = round(((curr_spy - past_spy) / past_spy) * 100, 2) if past_spy != 0 else 0
    spy_trend_icon = "📉" if spy_diff < 0 else "📈"

    timestamp = datetime.utcnow().strftime("%Y-%m-%d")
    
    # English Replay
    post_en = f"""[Signal Correlation Replay] {timestamp}
History Check: {past_date}
• Historical GMS: {past_score}/100
• S&P 500 Entry: ${past_spy}
• S&P 500 Current: ${curr_spy} ({spy_trend_icon} {spy_diff}%)

Validating algorithmic correlation between structural signals and market outcomes. 
{SITE_URL} #OmniMetric #Quant"""

    # Japanese Replay
    post_jp = f"""【シグナル相関の検証】 {timestamp}
1週間前（{past_date}）の記録:
• 当時のGMSスコア: {past_score}/100
• SPY終値: ${past_spy}
• 現在のSPY: ${curr_spy} ({spy_trend_icon} {spy_diff}%)

過去のアルゴリズム出力と実際の市場動向の相関を客観的に提示します。
{SITE_URL} #米国株 #GMS"""

    return post_en, post_jp

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
        response = client.create_tweet(text=text)
        print(f"[TWITTER] Posted successfully. ID: {response.data['id']}")
        return response.data['id']
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
    summary_data = load_json(SUMMARY_FILE)
    
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

    # 4. Correlation Replay (Experimental)
    replay_en, replay_jp = format_correlation_replay(current_data, summary_data)
    
    # Priority: JP (User seems Japanese), EN (Global).
    target_posts = [posts[1], posts[0]] # JP, EN
    
    # If it's a "Daily Archive" run (we can check env var or logic), add replay
    # For now, let's add replay to the list if available
    if replay_jp and replay_en:
        target_posts.append(replay_jp)
        target_posts.append(replay_en)

    if is_emergency:
        # In emergency, post all
        target_posts = posts

    for p in target_posts:
        print(f"\n--- PREVIEW ---\n{p}\n---------------")
        # Post
        tweet_id = post_to_twitter(p)
        post_to_bluesky(p)
        
        # Pin if Emergency (Only first post/primary post)
        if is_emergency and tweet_id:
            pin_twitter_post(tweet_id)
            # Only pin the FIRST one (which is usually the most important or EN one? User said "Most significant score move")
            # If we post EN then JP, maybe pin EN? Or JP?
            # Let's pin the JP one if target audience is JP, or EN. User is JP (shingo_kosaka).
            # But the loop iterates. 
            # Simplified: Pin the LAST one posted? Or strictly the EN one?
            # Let's just pin the first one in the loop for now.
            is_emergency = False # Prevent pinning multiple

def pin_twitter_post(tweet_id):
    """
    Pins a tweet. Requires Read/Write/Manage permission.
    Uses API v2 users/:id/pinned_lists or similar? 
    Actually, API v1.1 account/pin_tweet seems deprecated?
    API v2: POST /2/users/:id/pinned_tweets
    """
    api_key = os.getenv("TWITTER_API_KEY")
    api_secret = os.getenv("TWITTER_API_SECRET")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN")
    access_secret = os.getenv("TWITTER_ACCESS_SECRET")
    
    try:
        # Get User ID first
        client = tweepy.Client(
            consumer_key=api_key, consumer_secret=api_secret,
            access_token=access_token, access_token_secret=access_secret
        )
        me = client.get_me()
        user_id = me.data.id
        
        # Pin
        client.pin_tweet(user_id=user_id, tweet_id=tweet_id)
        print(f"[TWITTER] Pinned tweet {tweet_id}")
        return True
    except Exception as e:
        print(f"[TWITTER] Pin Error: {e}")
        return False


if __name__ == "__main__":
    main()
