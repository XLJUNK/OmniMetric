# Health Check API Documentation

## Overview

The Health Check API provides real-time monitoring of the Global Macro Signal system's data freshness and operational status.

**Endpoint**: `GET /api/health`

## Purpose

- Monitor data pipeline health
- Detect stale or outdated signal data
- Enable external monitoring and alerting systems
- Provide operational visibility for DevOps

## Response Format

### Healthy Response (200 OK)

```json
{
  "status": "healthy",
  "healthy": true,
  "data": {
    "lastUpdate": "2026-01-26T10:05:00.000Z",
    "ageMinutes": 15,
    "ageHours": 0,
    "ageHuman": "15m ago",
    "gmsScore": 65.4,
    "expectedUpdateInterval": "30 minutes"
  }
}
```

### Warning Response (200 OK)

Data is 1-2 hours old (between 60-120 minutes):

```json
{
  "status": "warning",
  "healthy": false,
  "data": {
    "lastUpdate": "2026-01-26T08:30:00.000Z",
    "ageMinutes": 95,
    "ageHours": 1,
    "ageHuman": "1h 35m ago",
    "gmsScore": 65.4,
    "expectedUpdateInterval": "30 minutes"
  }
}
```

### Critical Response (200 OK)

Data is over 2 hours old (>120 minutes):

```json
{
  "status": "critical",
  "healthy": false,
  "data": {
    "lastUpdate": "2026-01-26T06:00:00.000Z",
    "ageMinutes": 245,
    "ageHours": 4,
    "ageHuman": "4h 5m ago",
    "gmsScore": 65.4,
    "expectedUpdateInterval": "30 minutes"
  }
}
```

### Error Response (503 Service Unavailable)

Data file not found:

```json
{
  "status": "error",
  "message": "Signal data not found",
  "healthy": false
}
```

### Error Response (500 Internal Server Error)

Unexpected error:

```json
{
  "status": "error",
  "message": "Error details here",
  "healthy": false
}
```

## Status Levels

| Status | Condition | Description |
|--------|-----------|-------------|
| `healthy` | Data < 60 minutes old | System operating normally |
| `warning` | Data 60-120 minutes old | Data is aging, investigate workflow |
| `critical` | Data > 120 minutes old | Data pipeline likely failed |
| `error` | File missing or parse error | System malfunction |

## Monitoring Integration

### Uptime Monitoring

Configure your monitoring service (UptimeRobot, Pingdom, etc.) to:

1. **URL**: `https://omnimetric.net/api/health`
2. **Interval**: Every 5-10 minutes
3. **Alert Condition**: `healthy: false` or HTTP status ≥ 500

### Example cURL

```bash
curl https://omnimetric.net/api/health
```

### Example Monitoring Script

```bash
#!/bin/bash
RESPONSE=$(curl -s https://omnimetric.net/api/health)
HEALTHY=$(echo $RESPONSE | jq -r '.healthy')

if [ "$HEALTHY" != "true" ]; then
  echo "ALERT: System unhealthy!"
  echo $RESPONSE | jq '.'
  # Send alert notification here
fi
```

### GitHub Actions Integration

Add to your workflow for pre-deployment checks:

```yaml
- name: Check System Health
  run: |
    HEALTH=$(curl -s https://omnimetric.net/api/health)
    STATUS=$(echo $HEALTH | jq -r '.status')
    if [ "$STATUS" == "critical" ] || [ "$STATUS" == "error" ]; then
      echo "::error::System health check failed: $STATUS"
      echo $HEALTH | jq '.'
      exit 1
    fi
```

## Expected Behavior

- **Normal Operation**: Data updates every 30 minutes via GitHub Actions workflow
- **Healthy Status**: Data age < 60 minutes
- **Warning Threshold**: 60 minutes (2x expected interval)
- **Critical Threshold**: 120 minutes (4x expected interval)

## Troubleshooting

### Data is Stale (Warning/Critical)

1. Check GitHub Actions workflow status: `https://github.com/YOUR_ORG/GlobalMacroSignal/actions`
2. Review workflow logs for `update.yml`
3. Verify API keys are valid (FRED, FMP, Gemini)
4. Check for rate limiting or API quota issues

### Data File Not Found (Error)

1. Verify `frontend/data/current_signal.json` exists
2. Check `update.yml` workflow completed successfully
3. Ensure file copy step in workflow is working

### No Timestamp in Data (Warning)

1. Verify `gms_engine.py` is writing timestamp field
2. Check data structure in `current_signal.json`
3. Review engine logs for errors

## Related Documentation

- [Environment Variables](./ENVIRONMENT_VARIABLES.md)
- [GitHub Actions Workflows](../.github/workflows/)
- [Project Specification](../PROJECT_SPEC.md)
