# PowerShell script to test production build locally
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Testing Production Build" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

Write-Host "`n1. Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Frontend built successfully" -ForegroundColor Green

Write-Host "`n2. Checking dist folder..." -ForegroundColor Yellow
if (Test-Path "dist/index.html") {
    Write-Host "✓ dist/index.html exists" -ForegroundColor Green
} else {
    Write-Host "✗ dist/index.html not found!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "`n3. Starting backend in production mode..." -ForegroundColor Yellow
Set-Location ../backend
$env:NODE_ENV="production"
npm start

