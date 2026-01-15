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
