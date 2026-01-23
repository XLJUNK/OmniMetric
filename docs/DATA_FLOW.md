# System Data Flow Architecture (v2.1.0)

> **Map for Developers**: This document defines how data flows from external sources to the user's screen.
> **Critical Concept**: "Static Bundling" - Data is baked into the frontend build, not fetched at runtime.

---

## 1. High-Level Pipeline (Chronological)

| Stage | Component | Action | Output |
| :--- | :--- | :--- | :--- |
| **1. Ingest** | `fetch_news.py` | Fetch raw news (RSS/HTML) from AccessWire, CNBC, Yahoo. | Raw Text / HTML |
| **2. Process** | `generate_insight.ts` | **(Node Bridge)** Call Gemini Flash for Translation (En -> Ja, Es, Cn, etc.). | Translated JSON |
| **3. Update** | `fetch_news.py` | Updates `current_signal.json` -> `intelligence` key. | Updated `backend/current_signal.json` |
| **4. Analyze** | `gms_engine.py` | Fetch Market Data (FMPv3, Yahoo) -> Calc GMS -> Gen AI Report. | Updated `backend/current_signal.json` |
| **5. Bundle** | `update.yml` | **(Critical)** Copy `backend/current_signal.json` -> `frontend/data/`. | `frontend/data/current_signal.json` |
| **6. Build** | `next build` | Next.js bundles the JSON file *into* the Edge Function code. | `.next/server/...` |
| **7. Serve** | `route.ts` | **(Runtime)** Static `import` serves bundled data. No FS access. | JSON Response to Client |

---

## 2. Component Details & Schemas

### A. News Pipeline (`fetch_news.py` + `generate_insight.ts`)
*   **Trigger**: GitHub Actions (Schedule/Dispatch).
*   **Path Resolution**: STRICT ABSOLUTE PATHS required for Node bridge.
*   **Output Schema (`intelligence` key)**:
    ```json
    "intelligence": {
        "news": [
            {
                "title": "Headline in English",
                "source": "CNBC",
                "url": "...",
                "published_at": "..."
            }
        ],
        "news_metadata": { "run_time": "YYYY-MM-DD HH:MM:SS" },
        "translations": {
            "ja": [ { "title": "日本語の見出し", ... } ],
            "es": [ { "title": "Título en español", ... } ],
            ... (cn, hi, id, ar, ru, de, fr, it, pt)
        }
    }
    ```

### B. Core Engine (`gms_engine.py`)
*   **Input**: FMP API (v3), Yahoo Finance.
*   **AI Gateway**: Vercel SDK-compatible URL construction for Gemini models.
*   **Critical Output**: `current_signal.json` (The Source of Truth).

### C. The "Handover" (GitHub Actions `update.yml`)
The bridge between Python Backend and Next.js Frontend.
```yaml
- name: Run GMS Engine
  run: python backend/gms_engine.py

- name: Prepare Frontend Data
  run: |
    mkdir -p frontend/data
    cp backend/current_signal.json frontend/data/current_signal.json
    # Must be committed for Vercel deployment to pick it up?
    # NO. In Vercel, this happens at build time.
    # But for our repo consistency, we commit it.
```

### D. Frontend Access (`route.ts`)
**Architecture**: Vercel Edge Runtime.
**Constraint**: No File System (`fs`) access.
**Solution**: Static Import.

```typescript
// ✅ CORRECT
import signalData from '../../../data/current_signal.json';

// ❌ WRONG (Causes Fallback/500)
// const fs = require('fs');
// const data = fs.readFileSync(path.join(...));
```

---

## 3. External Dependencies
1.  **Financial Modeling Prep (FMP)**:
    *   Endpoint: `/api/v3/economic_calendar` (v3 is strict requirement).
    *   Auth: `FMP_API_KEY`.
2.  **Gemini AI (Google)**:
    *   Models: `gemini-2.0-flash-exp`, `gemini-1.5-pro`.
    *   Auth: `GEMINI_API_KEY`.
3.  **IndexNow**:
    *   Pings Bing/Yandex on deployment.
    *   Auth: `INDEXNOW_KEY`.
