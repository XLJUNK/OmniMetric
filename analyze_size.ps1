$results = Get-ChildItem -Directory | ForEach-Object {
    $name = $_.Name
    $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    [PSCustomObject]@{ Name = $name; SizeMB = [Math]::Round($size / 1MB, 2) }
}
$results | Sort-Object SizeMB -Descending | Out-File -FilePath disk_usage.txt
