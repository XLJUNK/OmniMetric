import sys
import os
sys.path.insert(0, 'backend')

# Set environment variables for authentication
os.environ['BLUESKY_HANDLE'] = 'omnimetric-gms-ai.bsky.social'
os.environ['BLUESKY_PASSWORD'] = input("Enter Bluesky app password: ")

from sns_publisher_bsky import BlueskyPublisher

# Create test data
test_data = {
    'gms_score': 42,
    'market_data': {
        'DXY': {'price': 106.25},
        'HY_SPREAD': {'price': 3.45},
        'YIELD_SPREAD': {'price': 0.15}
    },
    'analysis': {
        'reports': {
            'JA': '経済指標の混在により、市場センチメントは慎重な姿勢を維持しています。金融政策の不確実性が続く中、投資家はリスク管理を強化しています。'
        }
    }
}

print("=" * 70)
print("日本語テスト投稿")
print("=" * 70)

publisher = BlueskyPublisher()

# Generate post preview
post_text = publisher.format_post(test_data, 'JA')
print("\n投稿内容プレビュー:")
print("-" * 70)
print(post_text)
print("-" * 70)
print(f"\n文字数: {len(post_text)} / 300")

# Confirm before posting
confirm = input("\n\nこの内容で投稿しますか？ (yes/no): ")

if confirm.lower() == 'yes':
    print("\n投稿中...")
    result = publisher.publish(test_data, lang='JA')
    
    if result:
        print(f"\n✅ 投稿成功!")
        print(f"投稿URI: {result}")
        print(f"\nBlueskyで確認: https://bsky.app/profile/omnimetric-gms-ai.bsky.social")
    else:
        print("\n❌ 投稿失敗")
else:
    print("\n投稿をキャンセルしました")
