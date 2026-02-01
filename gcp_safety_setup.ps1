# Check if gcloud is installed
if (-not (Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
    Write-Error "gcloud CLI is not installed or not in PATH. Please install Google Cloud SDK."
    exit 1
}

# 1. Verification
Write-Host "=== 1. Project Verification ===" -ForegroundColor Cyan
$project = gcloud config get-value project
if (-not $project) {
    Write-Error "No active project found. Run 'gcloud config set project YOUR_PROJECT_ID'"
    exit 1
}
Write-Host "Active Project: $project" -ForegroundColor Green

# 2. Budget Creation
Write-Host "`n=== 2. Budget Alert Setup (50 JPY / 1% Alert) ===" -ForegroundColor Cyan
Write-Host "Fetching Billing Accounts..."
gcloud beta billing accounts list --format="table(name,displayName,open)"

$billingId = Read-Host "Enter your Billing Account ID (from 'name' column above)"

if ($billingId) {
    Write-Host "Creating Budget 'Safety-Budget-50JPY'..."
    # Create budget: 50 JPY, alerting at 1% (0.01)
    # Note: Using --budget-amount=50JPY directly. If specific currency logic fails, fallback to '50' assuming account currency.
    # Notifications default to Billing Admins/Users.
    gcloud billing budgets create --billing-account=$billingId `
        --display-name="Safety-Budget-50JPY" `
        --budget-amount=50JPY `
        --threshold-rule=percent=0.01 `
        --calendar-period=month

    if ($?) {
        Write-Host "Budget created successfully!" -ForegroundColor Green
    }
    else {
        Write-Host "Budget creation failed. Check errors above." -ForegroundColor Red
    }
}
else {
    Write-Host "Skipping budget creation (No ID provided)." -ForegroundColor Yellow
}

# 3. Quota Cap (Gemini API)
Write-Host "`n=== 3. Gemini API Quota Cap (1,500 Requests/Day) ===" -ForegroundColor Cyan
Write-Host "Note: Quota management via CLI is consistent locally but exact metric IDs can vary."

# Target service
$service = "generativelanguage.googleapis.com"
$consumer = "projects/$project"

# Attempt to List Quotas to find the exact metric for 'Daily' requests
Write-Host "Checking current quotas for $service..."
# We look for a metric that mentions "day" or "daily" and "request"
$quotaInfo = gcloud alpha services quota list --service=$service --consumer=$consumer --format="json" | ConvertFrom-Json

# Heuristic to find the daily request limit
$dailyMetric = $quotaInfo | Where-Object { $_.metric -like "*requests*" -and ($_.unit -like "*1/d*" -or $_.displayName -like "*day*") } | Select-Object -First 1

if ($dailyMetric) {
    $metricName = $dailyMetric.metric
    Write-Host "Found Daily Metric: $metricName" -ForegroundColor Green
    
    # Update Quota
    Write-Host "Applying cap of 1500 to $metricName..."
    gcloud alpha services quota update `
        --service=$service `
        --consumer=$consumer `
        --metric=$metricName `
        --unit="1/d" `
        --value=1500 `
        --force

    if ($?) {
        Write-Host "Quota cap applied successfully!" -ForegroundColor Green
    }
}
else {
    Write-Host "Could not automatically identify the 'Daily Request' metric." -ForegroundColor Yellow
    Write-Host "Common Metric Names exist like 'generativelanguage.googleapis.com/quota/daily_requests' but vary."
    Write-Host "Please verify in Console: IAM & Admin > Quotas > Generative Language API"
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "Please verify created items:"
Write-Host "1. https://console.cloud.google.com/billing/$billingId/budgets"
Write-Host "2. https://console.cloud.google.com/iam-admin/quotas?project=$project"
