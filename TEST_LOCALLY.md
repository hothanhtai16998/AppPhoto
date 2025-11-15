# Test Locally Before Deploying

## Windows PowerShell Commands

### Test Frontend Build

```powershell
# Navigate to frontend
cd frontend

# Build frontend
npm run build

# Check if dist folder exists
Test-Path dist/index.html
```

### Test Backend Serving Static Files

In PowerShell, set environment variables differently:

```powershell
# Option 1: Set for current session
$env:NODE_ENV="production"
cd backend
npm start

# Option 2: Set inline (one line)
$env:NODE_ENV="production"; cd backend; npm start
```

### Test Full Build and Start

```powershell
# From project root
npm run build

# Set environment and start
$env:NODE_ENV="production"
npm start
```

---

## Alternative: Use Git Bash or WSL

If you have Git Bash installed:

```bash
# Git Bash / WSL syntax (Unix-style)
cd frontend
npm run build
cd ../backend
NODE_ENV=production npm start
```

---

## Quick Test Script for Windows

Create a file `test-production.ps1`:

```powershell
# test-production.ps1
Write-Host "Building frontend..." -ForegroundColor Green
cd frontend
npm run build

Write-Host "Starting backend in production mode..." -ForegroundColor Green
cd ../backend
$env:NODE_ENV="production"
npm start
```

Run it:
```powershell
.\test-production.ps1
```

---

## What to Check

After starting the server, visit:
- `http://localhost:3000` - Should show your React homepage
- `http://localhost:3000/health` - Should show `{"status":"ok"...}`
- `http://localhost:3000/api/auth/signup` - Should show API error (that's OK)

If you see your homepage at `http://localhost:3000`, it means:
✅ Frontend build works
✅ Static file serving works
✅ Should work on Render too!

If you see API message instead:
❌ Check if `frontend/dist` folder exists
❌ Check backend logs for "Static files not found"
❌ Verify the path detection is working

