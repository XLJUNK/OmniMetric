import os
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set environment variables
os.environ['BLUESKY_HANDLE'] = 'omnimetric-gms-ai.bsky.social'
os.environ['BLUESKY_PASSWORD'] = '$k99003746'

# Import and test
from sns_publisher_bsky import BlueskyPublisher

print("=== Bluesky Authentication Test ===")
print(f"Handle: {os.environ['BLUESKY_HANDLE']}")
print(f"Password: {'*' * len(os.environ['BLUESKY_PASSWORD'])}")
print()

try:
    publisher = BlueskyPublisher()
    
    # Create test data in the expected format
    test_data = {
        "gms_score": 55,
        "gms_trend": "NEUTRAL",
        "timestamp": "2026-02-13T10:36:00+09:00",
        "market_data": {
            "DXY": {"price": 106.25},
            "HY_SPREAD": {"price": 3.45},
            "YIELD_SPREAD": {"price": 0.15}
        },
        "analysis": {
            "reports": {
                "EN": "Market sentiment remains cautious amid mixed economic signals.",
                "JA": "経済指標の混在により、市場センチメントは慎重な姿勢を維持しています。",
                "ZH": "在经济信号混杂的情况下,市场情绪保持谨慎。",
                "ES": "El sentimiento del mercado se mantiene cauteloso en medio de señales económicas mixtas."
            }
        }
    }
    
    print("Testing all languages...")
    print("=" * 60)
    
    for lang in ["JA", "ZH", "ES", "EN", "DE", "FR"]:
        print(f"\n{lang} Language Test:")
        print("-" * 60)
        result = publisher.publish(test_data, lang=lang)
        
        if result:
            print(f"✅ SUCCESS: {lang} post published")
            print(f"Post URI: {result}")
        else:
            print(f"❌ FAILED: {lang} post was not published")
        
except Exception as e:
    print(f"❌ ERROR: {type(e).__name__}")
    print(f"Message: {str(e)}")
    import traceback
    traceback.print_exc()
