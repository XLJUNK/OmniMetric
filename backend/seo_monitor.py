import os
import json
import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build

# CONFIG
KEY_FILE = os.path.join(os.path.dirname(__file__), 'gsc_credentials.json') # User needs to provide this
SITE_URL = 'https://omnimetric.net/' # Must match GSC property exactly
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), 'trending_keywords.json')

def get_gsc_service():
    if not os.path.exists(KEY_FILE):
        print(f"[SEO] Error: Credentials file not found at {KEY_FILE}")
        return None
    
    scopes = ['https://www.googleapis.com/auth/webmasters.readonly']
    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=scopes)
    return build('webmasters', 'v3', credentials=creds)

def fetch_top_keywords(service):
    """
    Fetches top 5 queries from the last 7 days.
    """
    # Date range: Last 7 days
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=7)
    
    request = {
        'startDate': start_date.strftime('%Y-%m-%d'),
        'endDate': end_date.strftime('%Y-%m-%d'),
        'dimensions': ['query'],
        'rowLimit': 5,
        'aggregationType': 'byProperty'
    }
    
    try:
        response = service.searchanalytics().query(siteUrl=SITE_URL, body=request).execute()
        rows = response.get('rows', [])
        
        keywords = []
        for row in rows:
            query = row['keys'][0]
            # Simple clean up: remove spaces for hashtag compatibility if needed, or keep phrases
            # For hashtags, we usually want to remove spaces and title case
            hashtag = "#" + query.title().replace(" ", "")
            keywords.append(hashtag)
            
        print(f"[SEO] Top Keywords found: {keywords}")
        return keywords
    except Exception as e:
        print(f"[SEO] API Error: {e}")
        return []

def main():
    print("--- OMNIMETRIC SEO MONITOR ---")
    service = get_gsc_service()
    if not service:
        # Fallback for dry run / initial setup
        print("[SEO] Using fallback keywords (No API connection)")
        fallback = ["#GlobalMacro", "#MarketRisk", "#VIX"]
        with open(OUTPUT_FILE, 'w') as f:
            json.dump({"hashtags": fallback, "updated": str(datetime.datetime.now())}, f, indent=2)
        return

    keywords = fetch_top_keywords(service)
    
    if keywords:
        data = {
            "hashtags": keywords,
            "updated": str(datetime.datetime.now())
        }
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"[SEO] Saved trending keywords to {OUTPUT_FILE}")
    else:
        print("[SEO] No keywords found or API failed.")

if __name__ == "__main__":
    main()
