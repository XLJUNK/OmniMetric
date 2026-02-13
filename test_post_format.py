import sys
sys.path.insert(0, 'backend')
from sns_publisher_bsky import BlueskyPublisher

pub = BlueskyPublisher()

# Test data matching the user's example
data = {
    'gms_score': 37,
    'market_data': {
        'DXY': {'price': 96.95},
        'HY_SPREAD': {'price': 2.84},
        'YIELD_SPREAD': {'price': 0.39}
    },
    'analysis': {
        'reports': {
            'FR': 'Les marchés restent prudents face aux signaux économiques mitigés.',
            'EN': 'Markets remain cautious amid mixed economic signals.',
            'DE': 'Die Märkte bleiben angesichts gemischter Wirtschaftssignale vorsichtig.',
            'ES': 'Los mercados se mantienen cautelosos ante señales económicas mixtas.',
            'JA': '経済指標の混在により、市場は慎重な姿勢を維持しています。',
            'ZH': '在经济信号混杂的情况下,市场保持谨慎。'
        }
    }
}

print("="*70)
print("FRENCH POST (FR):")
print("="*70)
fr_post = pub.format_post(data, 'FR')
print(fr_post)
print(f"\nCharacter count: {len(fr_post)}")

print("\n" + "="*70)
print("ENGLISH POST (EN):")
print("="*70)
en_post = pub.format_post(data, 'EN')
print(en_post)
print(f"\nCharacter count: {len(en_post)}")

print("\n" + "="*70)
print("ALL LANGUAGE CHARACTER COUNTS:")
print("="*70)
for lang in ['FR', 'EN', 'DE', 'ES', 'JA', 'ZH']:
    post = pub.format_post(data, lang)
    print(f"{lang}: {len(post)} chars")
