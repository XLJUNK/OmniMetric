# Security Zero Exposure Rules (機密保持)

## 1. API Key Hardcoding Strictly Prohibited
- **Rule**: Never hardcode API keys (e.g., `AIza...`, `sk-...`) in source code, test code, scripts, or logs.
- **Scope**: All files within the project.
- **Action**: If a key is found, immediately remove it and revoke the key.

## 2. Strict Environment Variable Usage
- **Rule**: All secret information must be loaded from `.env` files.
- **Protection**: Ensure `.env` is listed in `.gitignore`.
- **Reference**: Use `process.env.KEY` (Node.js) or `os.environ["KEY"]` (Python).

## 3. Pre-Commit Quarantine Scan
- **Rule**: Before executing `git commit`, scan the diff for potential secrets.
- **Procedure**:
    1. Check staged files for regex patterns matching API keys.
    2. If a secret is detected, **ABORT** the commit process immediately.
    3. Notify the user of the detected exposure.

---
*Verified and Recorded: 2026-01-28*
