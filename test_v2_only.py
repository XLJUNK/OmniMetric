import os
import tweepy
from dotenv import load_dotenv

load_dotenv()

def test_v2_only():
    print("--- X API v2 (OAuth 2.0) Targeted Test ---")
    bearer_token = os.getenv("TWITTER_BEARER_TOKEN")
    
    # Attempt simple lookup with Bearer Token only (Minimum requirements)
    client = tweepy.Client(bearer_token=bearer_token)
    
    try:
        # Get info about a known user (e.g., Twitter Dev)
        user = client.get_user(username="TwitterDev")
        print(f"SUCCESS (Bearer Token): Found @{user.data.username}")
    except Exception as e:
        print(f"FAILED (Bearer Token): {e}")

    # Attempt with full OAuth 2.0 User Auth
    print("\n--- X API v2 (User Auth) Targeted Test ---")
    client_auth = tweepy.Client(
        consumer_key=os.getenv("TWITTER_API_KEY"),
        consumer_secret=os.getenv("TWITTER_API_SECRET"),
        access_token=os.getenv("TWITTER_ACCESS_TOKEN"),
        access_token_secret=os.getenv("TWITTER_ACCESS_SECRET")
    )
    
    try:
        me = client_auth.get_me()
        if me.data:
            print(f"SUCCESS (User Auth): Authenticated as @{me.data.username}")
        else:
            print("FAILED (User Auth): No data returned")
    except Exception as e:
        print(f"FAILED (User Auth): {e}")

if __name__ == "__main__":
    test_v2_only()
