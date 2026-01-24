# Bluesky Automation Specifications

## Overview
Automated posting system for Bluesky (`sns_publisher.py` + `bluesky_sequencer.py`), designed to distribute high-impact macro insights during prime market hours across different timezones.

## 1. Golden Schedule (JST Base)
The scheduler uses JST (UTC+9) as the reference time.
**Virtual Day Logic**: `00:00 - 05:59` JST is technically the next day, but logically treated as the "Previous Day" extensions (e.g., US Close).

### Weekday Schedule (Mon-Fri)
| Market | JST Time | Logic / Phase | Note |
|:---|:---|:---|:---|
| **JP (Pre)** | **07:05** | Pre-Market Analysis | Before Tokyo Open |
| **JP (Lunch)** | **10:35** | Mid-day Recap | Asia Lunch Break |
| **JP (Close)** | **14:05** | Closing Strategy | 1h before Tokyo Close |
| **US (Pre)** | **21:35** | US Pre-Market | Before NY Open |
| **US (Mid)** | **00:05** | US Mid-day | *Technically Next Day (Virtual)* |
| **US (Close)** | **05:05** | US Closing | *Technically Next Day (Virtual)* |

*Other slots exist for ZH, HI, ID, AR, ES mapped to their local prime times.*

### Weekend Schedule
| Region | JST Time | Content |
|:---|:---|:---|
| **JP** | Sat 09:35 | Weekly Recap (Asia) |
| **Global** | Sun 20:35 | Weekly Lookahead (Pre-Monday) |
| **US** | Sun 21:05 | *Mon Morning (Asia) / Sun Night (US)* |

## 2. Post Content Specifications

### Format
Standardized "Terminal Style" format for professional visibility.

```text
【GMS Score: {SCORE}/100】 [{TREND_TEXT}]

{AI_INSIGHT_SUMMARY (Max 2 sentences)}

{TAGS}
{URL}
```

### Multilingual Support
- **Trend Text**: Localized (e.g., `RISK-ON` (EN) / `リスク選好` (JP) / `ALZA` (ES)).
- **Threading**: Posts are linked in a thread sequence: `JP -> EN -> ES -> ...` to consolidate discussion.
- **Link Previews**: Points to specific language routes (e.g., `/jp`, `/es`).

## 3. Dynamic OGP Generation
Whenever a post is triggered, a unique, disposable Open Graph Protocol (OGP) image is generated.

### Visual Components
- **Canvas**: 1200x630 (Twitter/Bluesky Standard), Dark Theme (`#0f172a`).
- **Score**: Large Gauge visualization (Green > 60, Red < 40).
- **Trend**: Text description of the current regime.
- **Sectors**: Breakdown of `STOCKS`, `CRYPTO`, `FOREX`, `COMMODITIES` scores.
- **Date**: Current datestamp.

### Technical Implementation
- **Library**: `matplotlib`
- **Fonts**: `NotoSansJP-Bold.ttf` (Downloaded at runtime in CI/CD).
- **Lifecycle**: Generated -> Uploaded as Blob -> Attached to Post -> Deleted immediately.

## 4. Execution Flow (GitHub Actions)
1. **Trigger**: Cron `5,35 * * * *` (Every 30 mins).
2. **Setup**: Install Python dependencies (`atproto`, `matplotlib`) & Download Fonts.
3. **Sequencer Check**:
    - Calculates `JST Time` and `Virtual Weekday`.
    - If match found: Proceed to Generate & Post.
    - If no match: Log "Skipped" and exit (Cost efficient).
4. **Publish**: Serial execution if multiple languages match the same slot.
