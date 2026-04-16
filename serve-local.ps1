$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$port = if ($args.Count -gt 0) { [int]$args[0] } else { 8000 }
$url = "http://127.0.0.1:$port/index.html"

Write-Host "Serving $scriptDir on $url" -ForegroundColor Cyan
Start-Process $url
python -m http.server $port
