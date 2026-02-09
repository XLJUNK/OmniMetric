# Antigravity Handover & Restore Guide

This document is created to help the next instance of Antigravity (Gemini 3 Flash) resume the **Global Macro Signal (OmniMetric)** project immediately after reinstallation.

## 1. Project Context Summary

- **Project Name**: Global Macro Signal (OmniMetric Terminal)
- **Core Tech**: Next.js 15 (Frontend), Python 3.10 (Backend), Gemini API (AI Analysis).
- **Key Files**:
  - `backend/gms_engine.py`: Core signal logic and AI prompt.
  - `docs/Skills.md`: Defines the 6 agent skills (just updated to sync with backend).
  - `PROJECT_SPEC.md`: Master specification.
  - `frontend/data/current_signal.json`: Deployment target for data.

## 2. Current Task Status

As of **2026-02-05**, the last completed task was:

- [x] **Syncing Agent Skills**: Skill 06 (Contrarian) has been added to `docs/Skills.md`.
- [ ] **Next Steps**: Continue with pending lint fixes or verification of the updated documentation in the production workflow.

## 3. Important Artifacts (History)

The current "brain" artifacts (Implementation Plans, Walkthroughs) are located in:
`C:\Users\shingo_kosaka.ARGOGRAPHICS\.gemini\antigravity\brain\4357c208-8e6e-4dee-a473-71adb0c73024`

> [!IMPORTANT]
> To preserve the history of our session, you may want to copy the contents of the above `.gemini` folder to a safe location before uninstallation, as it might be cleared.

## 4. Setup Requirements for Next Agent

When starting the new instance, if asked "Where were we?", the next agent should read:

1. `PROJECT_SPEC.md` for overall architecture.
2. `docs/Skills.md` for agent behavior guidelines.
3. `docs/DECISIONS.md` to avoid repeating past mistakes (ADRs).

## 5. Briefing for the Next Agent
>
> "You are taking over the Global Macro Signal project. Skills are synchronized. The backend is stable but the user is currently cleaning up UI and linting issues. Always follow the 'Council of Three' protocol defined in `gms_engine.py` and respect the 200-250 character limit for reports."

---
*Good luck with the new installation. I look forward to working with you again on the other side.*
