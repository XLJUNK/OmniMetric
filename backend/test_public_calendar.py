import requests
import xml.etree.ElementTree as ET
from datetime import datetime
import json

def test_public_calendar():
    # Myfxbook RSS feed for economic calendar
    url = "https://www.myfxbook.com/rss/forex-economic-calendar"
    print(f"Testing Public RSS Calendar: {url}")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            root = ET.fromstring(response.content)
            items = root.findall('.//item')
            print(f"Found {len(items)} events.")
            
            events = []
            for item in items[:5]:
                title = item.find('title').text
                description = item.find('description').text
                pubDate = item.find('pubDate').text
                
                print(f"--- Event: {title} ---")
                print(f"Date: {pubDate}")
                print(f"Details: {description}")
                
                events.append({
                    "name": title,
                    "date": pubDate,
                    "description": description
                })
        else:
            print(f"Failed to fetch RSS: {response.status_code}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_public_calendar()
