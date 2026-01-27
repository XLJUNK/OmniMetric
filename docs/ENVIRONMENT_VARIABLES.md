# Environment Variables

Complete reference for all environment variables used in GlobalMacroSignal (OmniMetric Terminal).

---

## GitHub Secrets (Backend Automation)

Required for GitHub Actions workflows to function properly.

### API Keys

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API for AI analysis and translations | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `FRED_API_KEY` | ✅ Yes | Federal Reserve Economic Data API | [FRED API Keys](https://fred.stlouisfed.org/docs/api/api_key.html) |
| `FMP_API_KEY` | ✅ Yes | Financial Modeling Prep API for economic calendar | [FMP API](https://site.financialmodelingprep.com/developer/docs) |
| `AI_GATEWAY_API_KEY` | ⚠️ Optional | Vercel AI Gateway authentication | Vercel Dashboard |

### Social Media Integration

| Variable | Required | Description |
|----------|----------|-------------|
| `TWITTER_API_KEY` | ⚠️ Optional | X (Twitter) API Key |
| `TWITTER_API_SECRET` | ⚠️ Optional | X (Twitter) API Secret |
| `TWITTER_ACCESS_TOKEN` | ⚠️ Optional | X (Twitter) Access Token |
| `TWITTER_ACCESS_SECRET` | ⚠️ Optional | X (Twitter) Access Secret |
| `BLUESKY_HANDLE` | ⚠️ Optional | Bluesky handle (e.g., `user.bsky.social`) |
| `BLUESKY_PASSWORD` | ⚠️ Optional | Bluesky App Password |

### SEO & Indexing

| Variable | Required | Description |
|----------|----------|-------------|
| `INDEXNOW_KEY` | ⚠️ Optional | IndexNow API key for Bing/Yandex indexing |

---

## Vercel Environment Variables (Frontend)

Configure in Vercel Dashboard → Project Settings → Environment Variables.

### Production Environment

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | ✅ Yes | Server-side AI generation (same as GitHub) | `GOOGLE_API_KEY_FORMAT` |
| `AI_GATEWAY_API_KEY` | ⚠️ Optional | Vercel AI Gateway auth | `ag_...` |
| `NEXT_PUBLIC_GA_ID` | ⚠️ Optional | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` |

**Important**: Never use `NEXT_PUBLIC_` prefix for API keys. All AI calls must be server-side.

---

## Local Development (.env)

For local testing, create `.env` file in project root:

```bash
# Required
GEMINI_API_KEY=your_gemini_key_here
FRED_API_KEY=your_fred_key_here
FMP_API_KEY=your_fmp_key_here

# Optional
AI_GATEWAY_API_KEY=your_gateway_key_here
TWITTER_API_KEY=your_twitter_key_here
TWITTER_API_SECRET=your_twitter_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here
BLUESKY_HANDLE=your_handle.bsky.social
BLUESKY_PASSWORD=your_app_password_here
INDEXNOW_KEY=your_indexnow_key_here
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Note**: `.env` file is gitignored and never committed.

---

## Environment-Specific Behavior

### Missing API Keys

The system gracefully degrades when optional keys are missing:

| Missing Key | Behavior |
|-------------|----------|
| `GEMINI_API_KEY` | Falls back to cached analysis messages |
| `FMP_API_KEY` | Economic calendar shows empty |
| `TWITTER_*` | Twitter posting disabled |
| `BLUESKY_*` | Bluesky posting disabled |
| `INDEXNOW_KEY` | Search engine pinging skipped |

### Required Keys

If these are missing, workflows will fail:

- `FRED_API_KEY` - Core economic data
- `GEMINI_API_KEY` - AI analysis (with fallback)

---

## Security Best Practices

### ✅ DO
- Store all keys in GitHub Secrets / Vercel Environment Variables
- Use server-side API calls only
- Rotate keys periodically
- Use different keys for dev/prod if possible

### ❌ DON'T
- Commit `.env` file to git
- Use `NEXT_PUBLIC_` prefix for API keys
- Share keys in chat/email
- Hardcode keys in source code

---

## Verification

### Check GitHub Secrets
```bash
# In GitHub repo
Settings → Secrets and variables → Actions → Repository secrets
```

### Check Vercel Variables
```bash
# In Vercel Dashboard
Project → Settings → Environment Variables
```

### Test Locally
```bash
# Backend test
cd backend
python -c "import os; print('GEMINI_API_KEY:', 'SET' if os.getenv('GEMINI_API_KEY') else 'MISSING')"

# Frontend test
cd frontend
npm run dev
# Check console for API errors
```

---

## Troubleshooting

### "API Key Missing" Error

1. Check `.env` file exists in project root
2. Verify key is not empty or has extra spaces
3. Restart terminal/IDE after adding keys
4. For GitHub Actions, verify secret is set in repository settings

### "Invalid API Key" Error

1. Verify key hasn't expired
2. Check for typos when copying
3. Ensure correct key for correct service
4. Some APIs require billing enabled

### Workflow Fails with "No changes to commit"

This is normal - means no data changed. Not an error.

---

## Quick Setup Checklist

- [ ] Create `.env` file in project root
- [ ] Add `GEMINI_API_KEY`
- [ ] Add `FRED_API_KEY`
- [ ] Add `FMP_API_KEY`
- [ ] Configure GitHub Secrets (same 3 keys minimum)
- [ ] Configure Vercel Environment Variables
- [ ] Test locally: `python backend/gms_engine.py`
- [ ] Verify workflows run successfully

---

**Last Updated**: 2026-01-27  
**Related**: [PROJECT_SPEC.md](../PROJECT_SPEC.md)
