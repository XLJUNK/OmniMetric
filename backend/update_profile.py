import tweepy
import os
import sys

def update_profile():
    print(" Updating Twitter Profile...")
    
    api_key = os.getenv("TWITTER_API_KEY")
    api_secret = os.getenv("TWITTER_API_SECRET")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN")
    access_secret = os.getenv("TWITTER_ACCESS_SECRET")
    
    if not all([api_key, api_secret, access_token, access_secret]):
        print("Error: Missing credentials")
        return

    # Authenticate (v1.1 for profile updates)
    auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_secret)
    api = tweepy.API(auth)
    
    # 1. Update Bio & URL
    try:
        api.update_profile(
            description="AI駆動型グローバル・マクロ指標『GMSスコア』の公式速報。客観的データに基づき市場リスクを可視化。",
            url="https://omnimetric.net"
        )
        print("[SUCCESS] Bio and URL updated.")
    except Exception as e:
        print(f"[ERROR] Bio update failed: {e}")

    # 2. Update Icon
    # Look for icon.png first (converted), then jpg, then try svg?
    # Twitter does NOT support SVG.
    # We expect 'backend/icon_for_upload.png' to be prepared by the caller or exists.
    icon_path = os.path.join(os.path.dirname(__file__), "icon_for_upload.png")
    
    if os.path.exists(icon_path):
        try:
            api.update_profile_image(icon_path)
            print("[SUCCESS] Icon updated.")
        except Exception as e:
            print(f"[ERROR] Icon update failed: {e}")
    else:
        print(f"[WARNING] Icon file not found at {icon_path}. Skipping icon update.")

if __name__ == "__main__":
    update_profile()
