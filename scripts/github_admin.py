import os
import requests
import json
import sys

# Configuration
REPO_OWNER = "XLJUNK"
REPO_NAME = "OmniMetric"
TAG_VERSION = "v4.0.0"
TOKEN = os.environ.get("GITHUB_TOKEN")

if not TOKEN:
    print("Error: GITHUB_TOKEN environment variable is not set.")
    print("Please set it via: $env:GITHUB_TOKEN='your_pat_here'")
    sys.exit(1)

HEADERS = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

API_BASE = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}"

def publish_release():
    print(f"Creating Release for {TAG_VERSION}...")
    url = f"{API_BASE}/releases"
    data = {
        "tag_name": TAG_VERSION,
        "name": f"{TAG_VERSION} - Official First Release",
        "body": "First official release including Mobile UI overhaul, All-Blue theme, and security hardening.",
        "draft": False,
        "prerelease": False,
        "make_latest": "true"
    }
    
    # Check if exists first to avoid 422
    check_url = f"{API_BASE}/releases/tags/{TAG_VERSION}"
    check = requests.get(check_url, headers=HEADERS)
    
    if check.status_code == 200:
        print(f"Release for {TAG_VERSION} already exists. Updating...")
        release_id = check.json()['id']
        update_url = f"{API_BASE}/releases/{release_id}"
        resp = requests.patch(update_url, headers=HEADERS, json=data)
    else:
        resp = requests.post(url, headers=HEADERS, json=data)

    if resp.status_code in [200, 201]:
        print("✅ Release Published Successfully!")
    else:
        print(f"❌ Failed to publish release: {resp.status_code} {resp.text}")

def protect_branch():
    print("Protecting 'main' branch...")
    # Using Rulesets API (modern) or Branch Protection API (classic)
    # User asked for "Repo Ruleset" specifically.
    
    url = f"{API_BASE}/rulesets"
    data = {
        "name": "Main Branch Protection",
        "target": "branch",
        "enforcement": "active",
        "conditions": {
            "ref_name": {
                "exclude": [],
                "include": ["refs/heads/main"]
            }
        },
        "rules": [
            {"type": "deletion"},
            {"type": "non_fast_forward"} 
        ]
    }
    
    resp = requests.post(url, headers=HEADERS, json=data)
    if resp.status_code == 201:
        print("✅ Branch Ruleset Created!")
    elif resp.status_code == 422: # Might already exist, or invalid
        print(f"⚠️  Ruleset might already exist or invalid data: {resp.text}")
    else:
        print(f"❌ Failed to create ruleset: {resp.status_code} {resp.text}")

if __name__ == "__main__":
    publish_release()
    protect_branch()
