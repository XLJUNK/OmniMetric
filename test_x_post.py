import os
import sys
import time
import json
from datetime import datetime
import tweepy
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {msg}")

def test_x_api():
    log("Starting X (Twitter) API Unit Test")
    
    # Read credentials
    api_key = os.getenv("TWITTER_API_KEY")
    api_secret = os.getenv("TWITTER_API_SECRET")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN")
    access_secret = os.getenv("TWITTER_ACCESS_SECRET")
    bearer_token = os.getenv("TWITTER_BEARER_TOKEN")
    
    # Credential Check
    creds = {
        "TWITTER_API_KEY": api_key,
        "TWITTER_API_SECRET": api_secret,
        "TWITTER_ACCESS_TOKEN": access_token,
        "TWITTER_ACCESS_SECRET": access_secret,
        "TWITTER_BEARER_TOKEN": bearer_token
    }
    
    missing = [k for k, v in creds.items() if not v]
    if missing:
        log(f"WARNING: Missing environment variables: {', '.join(missing)}")
        log("Please ensure these are set in your .env file.")
        # Proceed anyway to see the error from tweepy
    
    # Initialize Clients
    # v2 Client (for Tweets and Auth Check)
    client = tweepy.Client(
        bearer_token=bearer_token,
        consumer_key=api_key,
        consumer_secret=api_secret,
        access_token=access_token,
        access_token_secret=access_secret,
        wait_on_rate_limit=True
    )
    
    # v1.1 API (for Media Upload)
    auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_secret)
    api_v1 = tweepy.API(auth)
    
    # Phase 1: Auth Check (GET /2/users/me)
    log("-" * 40)
    log("PHASE 1: Connectivity & Auth Check")
    try:
        user = client.get_me(user_auth=True)
        if user and user.data:
            log(f"SUCCESS: Authenticated as @{user.data.username} (ID: {user.data.id})")
        else:
            log("FAILED: Auth check returned no data.")
    except tweepy.TweepyException as e:
        log(f"ERROR in Phase 1: {e}")
        if hasattr(e, 'response') and e.response is not None:
            log(f"Status: {e.response.status_code}")
            log(f"Body: {e.response.text}")
        else:
            log(f"Raw Exception: {type(e).__name__}: {str(e)}")
            
    # Phase 2: Text Post Test
    log("-" * 40)
    log("PHASE 2: Text Posting Test")
    timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    text = f"Test post from OmniMetric Terminal [{timestamp_str}]"
    try:
        response = client.create_tweet(text=text)
        if response and response.data:
            log(f"SUCCESS: Tweet posted! ID: {response.data['id']}")
        else:
            log("FAILED: create_tweet returned no data.")
    except tweepy.TweepyException as e:
        log(f"ERROR in Phase 2: {e}")
        if hasattr(e, 'response') and e.response is not None:
            log(f"Status: {e.response.status_code}")
            log(f"Body: {e.response.text}")
            
            if e.response.status_code == 403:
                log("HINT: 403 Forbidden often means your API Plan (Free) does not have write permissions or you reached a limit.")
            elif e.response.status_code == 401:
                log("HINT: 401 Unauthorized means credentials (API Key/Secret/Tokens) are invalid.")
            elif e.response.status_code == 429:
                log("HINT: 429 Too Many Requests means you are rate limited.")
        else:
            log(f"Raw Exception: {type(e).__name__}: {str(e)}")

    # Phase 3: Media Post Test
    log("-" * 40)
    log("PHASE 3: Media Upload & Posting Test")
    # Create a minimal black 1x1 png if not exists
    test_media = "test_media.png"
    if not os.path.exists(test_media):
        try:
            from PIL import Image
            img = Image.new('RGB', (1, 1), color='black')
            img.save(test_media)
            log(f"Created temporary test media: {test_media}")
        except ImportError:
            log("PIL not found. Attempting to use existing icon_for_upload.png if available.")
            alt_media = os.path.join("backend", "icon_for_upload.png")
            if os.path.exists(alt_media):
                test_media = alt_media
                log(f"Using existing media: {test_media}")
            else:
                log("No test media available and PIL missing. Skipping Phase 3.")
                test_media = None

    if test_media and os.path.exists(test_media):
        try:
            log(f"Uploading media: {test_media}")
            media = api_v1.media_upload(filename=test_media)
            media_id = media.media_id
            log(f"SUCCESS: Media uploaded. Media ID: {media_id}")
            
            log("Posting tweet with media...")
            media_text = f"Test media post from OmniMetric Terminal [{timestamp_str}]"
            response = client.create_tweet(text=media_text, media_ids=[media_id])
            if response and response.data:
                log(f"SUCCESS: Media tweet posted! ID: {response.data['id']}")
            else:
                log("FAILED: Media tweet returned no data.")
        except tweepy.TweepyException as e:
            log(f"ERROR in Phase 3: {e}")
            if hasattr(e, 'response') and e.response is not None:
                log(f"Status: {e.response.status_code}")
                log(f"Body: {e.response.text}")
            else:
                log(f"Raw Exception: {type(e).__name__}: {str(e)}")
        finally:
            if test_media == "test_media.png" and os.path.exists(test_media):
                os.remove(test_media)
                log("Cleaned up temporary media.")
    
    log("-" * 40)
    log("Unit Test Completed.")

if __name__ == "__main__":
    test_x_api()
