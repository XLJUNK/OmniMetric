
import os

KEY = "AIzaSyCKim9M0XLBkN8SCiEpFlHr8BeUK2F1Ox4"
ENV_PATH = ".env"

print("--- FIXING .ENV ---")
lines = []
try:
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        print(f"Read {len(lines)} lines from .env")
    else:
        print(".env not found, creating new.")
except Exception as e:
    print(f"Error reading .env: {e}")

new_lines = []
written_keys = set()

# Preserve existing keys except Gemini
for line in lines:
    stripped = line.strip()
    if not stripped or stripped.startswith('#'):
        new_lines.append(line)
        continue
    
    key_part = stripped.split('=')[0]
    if key_part in ["GEMINI_API_KEY", "NEXT_PUBLIC_GEMINI_API_KEY"]:
        continue
    
    new_lines.append(line)

# Ensure newline
if new_lines and not new_lines[-1].endswith('\n'):
    new_lines[-1] += '\n'

# Append new keys
new_lines.append(f"GEMINI_API_KEY={KEY}\n")
new_lines.append(f"NEXT_PUBLIC_GEMINI_API_KEY={KEY}\n")

try:
    with open(ENV_PATH, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("SUCCESS: .env updated cleanly.")
except Exception as e:
    print(f"CRITICAL: Failed to write .env: {e}")
