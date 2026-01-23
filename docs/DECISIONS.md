# Architectural Decision Record (ADR)
This document records key decisions and their context to prevent regression loops.

## [ADR-001] GitBot Update Frequency
**Date:** 2026-01-15
**Status:** ACCEPTED

### Context
Autopilot updates (`.github/workflows/update.yml`) were originally set to 15-minute intervals.
However, Python dependency installation (`pandas`, `numpy`, etc.) takes significant time on GitHub Actions runners, creating overhead and potential timeout risks.

### Decision
- Set cron schedule to **30 minutes** (`5,35 * * * *`).
- Use `backend/requirements.txt` to enable `actions/setup-python` caching (`cache: 'pip'`).

### Consequences
- (+) Reduces runner load and wasted minutes.
- (+) Improves reliability of completion within timeout limits.
- (-) Updates are less "real-time" (30 min lag max).

### Prevention Rule
**DO NOT revert to 15-minute intervals** unless the build time is proven to be consistently under 2 minutes via cache optimization.

---

## [ADR-002] Static Bundling for Edge Compatibility
**Date:** 2026-01-24
**Status:** ACCEPTED

### Context
The Vercel Edge Runtime (used for high-performance global API distribution) **does not support the Node.js `fs` (File System) module**.
Attempts to read `current_signal.json` at runtime via `fs.readFileSync` caused persistent Fallback/500 errors on the frontend.

### Decision
- **Adopt "Static Bundling"**:
    1.  In GitHub Actions (`update.yml`), copy `backend/current_signal.json` to `frontend/data/current_signal.json` *before* the build.
    2.  In `frontend/app/api/news/route.ts`, use **ES6 Static Import** (`import signalData from ...`).
- **Data Flow**: The JSON data becomes part of the code bundle itself during `next build`.

### Consequences
- (+) **Zero Latency**: Data is in memory; no file I/O or database request at runtime.
- (+) **Edge Compatible**: Works perfectly on Vercel Edge.
- (+) **Stability**: Prevents "file not found" errors in production.
- (-) **Staleness**: Data is only as fresh as the last Deployment/Build. (Addressed by simple redeployment triggers).

### Prevention Rule
**NEVER use `fs.readFileSync` in `frontend/` code** meant for the Edge. Always prefer `import` for static data.

---

## [ADR-003] FMP v3 API Migration
**Date:** 2026-01-24
**Status:** ACCEPTED

### Context
The FMP legacy endpoint (`/stable/economic-calendar`) was deprecated, returning error dictionaries instead of lists, causing `gms_engine.py` to crash.
This instability disrupted the entire data pipeline.

### Decision
- **Force Migration to v3**: Use `/api/v3/economic_calendar`.
- **Strict Error Handling**: Wrap data fetching in checks that strictly validate the response type (Must be `list`). If an error dict is returned, log it and return an empty list rather than crashing.

### Consequences
- (+) **Reliability**: Engine survives API hiccups.
- (+) **Future-Proof**: v3 is the current standard.
