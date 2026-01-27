# Architecture Documentation

## Overview

This document provides a comprehensive overview of the Global Macro Signal (GMS) system architecture, including system components, data flows, and deployment infrastructure.

---

## System Architecture

```mermaid
graph TB
    subgraph "External Data Sources"
        FRED[FRED API<br/>Economic Data]
        FMP[FMP API<br/>Market Data]
        YAHOO[Yahoo Finance<br/>Commodity Prices]
        NEWS[News APIs<br/>Market Intelligence]
    end
    
    subgraph "GitHub Actions Workflows"
        UPDATE[update.yml<br/>Every 30 min]
        WIKI[update_wiki.yml<br/>Every 20 min]
        ARCHIVE[daily_archive.yml<br/>Daily 21:00 UTC]
        TEST[test.yml<br/>On Push/PR]
    end
    
    subgraph "Backend Processing"
        ENGINE[gms_engine.py<br/>Core Signal Generator]
        FETCH[fetch_news.py<br/>News Aggregator]
        SNS[sns_publisher.py<br/>Social Media Bot]
        WIKI_GEN[enhance_wiki.py<br/>Wiki Generator]
        LOGGER[log_utils.py<br/>Centralized Logging]
    end
    
    subgraph "AI Services"
        GEMINI[Gemini API<br/>via Vercel Gateway]
    end
    
    subgraph "Data Storage"
        SIGNAL[current_signal.json<br/>Latest Data]
        ARCHIVE_DATA[archive/*.json<br/>Historical Data]
        WIKI_DATA[wiki/*.json<br/>777 Wiki Files]
    end
    
    subgraph "Frontend (Next.js)"
        PAGES[Pages<br/>Dashboard, Wiki, Archive]
        API[API Routes<br/>/api/health, /api/news]
        COMPONENTS[Components<br/>Charts, News Ticker]
    end
    
    subgraph "Deployment"
        VERCEL[Vercel<br/>Production Hosting]
        GITHUB[GitHub<br/>Version Control]
    end
    
    subgraph "Social Media"
        TWITTER[Twitter/X]
        BLUESKY[Bluesky]
    end
    
    FRED --> ENGINE
    FMP --> ENGINE
    YAHOO --> ENGINE
    NEWS --> FETCH
    
    UPDATE --> ENGINE
    UPDATE --> FETCH
    UPDATE --> SNS
    WIKI --> WIKI_GEN
    ARCHIVE --> ENGINE
    TEST --> LOGGER
    
    ENGINE --> GEMINI
    FETCH --> GEMINI
    WIKI_GEN --> GEMINI
    
    ENGINE --> SIGNAL
    ENGINE --> ARCHIVE_DATA
    WIKI_GEN --> WIKI_DATA
    
    ENGINE --> LOGGER
    FETCH --> LOGGER
    SNS --> LOGGER
    
    SIGNAL --> API
    ARCHIVE_DATA --> API
    WIKI_DATA --> PAGES
    
    API --> PAGES
    PAGES --> COMPONENTS
    
    GITHUB --> VERCEL
    VERCEL --> PAGES
    
    SNS --> TWITTER
    SNS --> BLUESKY
    
    style ENGINE fill:#4CAF50
    style SIGNAL fill:#2196F3
    style VERCEL fill:#FF9800
    style GEMINI fill:#9C27B0
```

---

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant GHA as GitHub Actions
    participant Engine as gms_engine.py
    participant APIs as External APIs
    participant AI as Gemini API
    participant Storage as JSON Files
    participant Frontend as Next.js
    participant User as End User
    
    Note over GHA: Every 30 minutes
    GHA->>Engine: Trigger execution
    
    Engine->>APIs: Fetch economic data
    APIs-->>Engine: Return market data
    
    Engine->>Engine: Calculate indicators
    Engine->>Engine: Compute GMS score
    
    Engine->>AI: Request analysis
    AI-->>Engine: Return AI insights
    
    Engine->>Storage: Write current_signal.json
    Engine->>Storage: Update archive/*.json
    
    GHA->>Frontend: Deploy to Vercel
    
    User->>Frontend: Visit omnimetric.net
    Frontend->>Storage: Read current_signal.json
    Storage-->>Frontend: Return latest data
    Frontend-->>User: Display dashboard
    
    User->>Frontend: Request /api/health
    Frontend->>Storage: Check data freshness
    Storage-->>Frontend: Return timestamp
    Frontend-->>User: Health status
```

---

## Deployment Architecture

```mermaid
graph LR
    subgraph "Development"
        DEV[Local Development<br/>npm run dev]
        GIT[Git Repository<br/>GitHub]
    end
    
    subgraph "CI/CD Pipeline"
        ACTIONS[GitHub Actions<br/>Workflows]
        TEST_FLOW[Test Workflow<br/>test.yml]
        UPDATE_FLOW[Update Workflow<br/>update.yml]
    end
    
    subgraph "Production"
        VERCEL[Vercel Platform<br/>Edge Network]
        CDN[Global CDN<br/>Static Assets]
        EDGE[Edge Functions<br/>API Routes]
    end
    
    subgraph "Monitoring"
        HEALTH[Health Check API<br/>/api/health]
        LOGS[Centralized Logs<br/>log_utils.py]
    end
    
    DEV --> GIT
    GIT --> ACTIONS
    ACTIONS --> TEST_FLOW
    ACTIONS --> UPDATE_FLOW
    
    TEST_FLOW --> ACTIONS
    UPDATE_FLOW --> VERCEL
    
    VERCEL --> CDN
    VERCEL --> EDGE
    
    EDGE --> HEALTH
    UPDATE_FLOW --> LOGS
    
    style VERCEL fill:#000000,color:#fff
    style ACTIONS fill:#2088FF,color:#fff
    style HEALTH fill:#4CAF50
```

---

## Component Breakdown

### Backend Components

| Component | Purpose | Frequency |
|-----------|---------|-----------|
| `gms_engine.py` | Core signal generation | Every 30 min |
| `fetch_news.py` | News aggregation & translation | Every 30 min |
| `sns_publisher.py` | Social media posting | Every 30 min |
| `enhance_wiki.py` | Wiki content generation | Every 20 min |
| `log_utils.py` | Centralized logging | On-demand |

### Frontend Components

| Component | Purpose | Type |
|-----------|---------|------|
| Dashboard | Main GMS display | Page |
| Wiki | Educational content | Page |
| Archive | Historical data | Page |
| `/api/health` | System monitoring | API Route |
| `/api/news` | News endpoint | API Route |

### External Dependencies

| Service | Purpose | Criticality |
|---------|---------|-------------|
| FRED API | Economic indicators | **Critical** |
| FMP API | Market data | **Critical** |
| Gemini API | AI analysis | **Critical** |
| Yahoo Finance | Commodity prices | High |
| Twitter API | Social posting | Medium |
| Bluesky API | Social posting | Medium |

---

## Workflow Orchestration

```mermaid
graph TD
    START[Scheduled Trigger] --> UPDATE{update.yml}
    UPDATE --> PYTHON[Setup Python]
    UPDATE --> NODE[Setup Node.js]
    
    PYTHON --> CACHE_PIP[Cache pip]
    NODE --> CACHE_NPM[Cache npm]
    
    CACHE_PIP --> INSTALL_PY[Install Python deps]
    CACHE_NPM --> INSTALL_NODE[Install Node deps]
    
    INSTALL_PY --> RUN_ENGINE[Run gms_engine.py]
    INSTALL_NODE --> RUN_FETCH[Run fetch_news.py]
    
    RUN_ENGINE --> WRITE_DATA[Write current_signal.json]
    RUN_FETCH --> WRITE_DATA
    
    WRITE_DATA --> COPY[Copy to frontend/data/]
    COPY --> COMMIT[Git commit]
    COMMIT --> REBASE[Git pull --rebase]
    REBASE --> PUSH[Git push]
    
    PUSH --> DEPLOY[Vercel Auto-deploy]
    DEPLOY --> END[Complete]
    
    style RUN_ENGINE fill:#4CAF50
    style DEPLOY fill:#FF9800
```

---

## Security Architecture

```mermaid
graph TB
    subgraph "Secret Management"
        GITHUB_SECRETS[GitHub Secrets<br/>API Keys]
        VERCEL_ENV[Vercel Env Vars<br/>Runtime Config]
    end
    
    subgraph "Security Layers"
        REDACTION[Log Redaction<br/>API Key Masking]
        GITIGNORE[.gitignore<br/>Exclude .env]
        SERVER_SIDE[Server-side API Calls<br/>No Client Exposure]
    end
    
    subgraph "Data Protection"
        HTTPS[HTTPS Only<br/>TLS 1.3]
        EDGE[Edge Runtime<br/>Isolated Execution]
    end
    
    GITHUB_SECRETS --> SERVER_SIDE
    VERCEL_ENV --> SERVER_SIDE
    
    SERVER_SIDE --> REDACTION
    REDACTION --> GITIGNORE
    
    GITIGNORE --> HTTPS
    HTTPS --> EDGE
    
    style REDACTION fill:#F44336,color:#fff
    style HTTPS fill:#4CAF50,color:#fff
```

---

## Scaling Considerations

### Current Capacity

- **Update Frequency**: Every 30 minutes
- **Wiki Generation**: Every 20 minutes (777 files total)
- **Concurrent Users**: Unlimited (Vercel Edge CDN)
- **Data Storage**: JSON files (lightweight, fast)

### Bottlenecks

1. **API Rate Limits**: FRED, FMP, Gemini quotas
2. **Workflow Execution Time**: ~5-7 minutes per run
3. **Wiki Generation**: ~40 hours total (accelerated to ~13 hours)

### Future Optimizations

- Database migration for historical data
- Caching layer for API responses
- Parallel wiki generation
- WebSocket for real-time updates

---

## Disaster Recovery

### Backup Strategy

- **Git History**: Full version control
- **Archive Files**: Daily snapshots in `archive/*.json`
- **Git Tags**: Stable releases (e.g., `V4.7-STABLE`)

### Recovery Procedures

1. **Data Loss**: Restore from `archive/*.json` or Git history
2. **Workflow Failure**: Check logs, rerun manually
3. **API Outage**: Fallback to cached data
4. **Deployment Issue**: Rollback to previous Git tag

---

## Monitoring & Observability

### Health Monitoring

- **Endpoint**: `/api/health`
- **Metrics**: Data age, GMS score, system status
- **Alerts**: `healthy`, `warning`, `critical`, `error`

### Logging

- **Centralized**: `log_utils.py`
- **Formats**: Text (default), JSON (optional)
- **Rotation**: 10MB max, 5 backups
- **Redaction**: Automatic API key masking

### GitHub Actions Logs

- Workflow execution history
- Step-by-step output
- Error traces and debugging

---

## Technology Stack

### Backend

- **Language**: Python 3.11
- **Key Libraries**: `requests`, `pandas`, `python-dotenv`
- **AI**: Gemini API (via Vercel AI Gateway)

### Frontend

- **Framework**: Next.js 16.1.1 (App Router)
- **Runtime**: Vercel Edge
- **Styling**: Vanilla CSS
- **Charts**: Recharts

### Infrastructure

- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Version Control**: Git/GitHub
- **CDN**: Vercel Edge Network

---

## Related Documentation

- [Environment Variables](./ENVIRONMENT_VARIABLES.md)
- [Health Check API](./HEALTH_CHECK_API.md)
- [Testing Guide](./TESTING.md)
- [Project Specification](../PROJECT_SPEC.md)
