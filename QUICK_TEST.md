# Quick Test Commands for Windows PowerShell

## ✅ Easiest Way (Use npm script)

```powershell
npm run test:production
```

This will:
1. Build the frontend
2. Start backend in production mode

---

## ✅ Alternative: Manual PowerShell Commands

### Step 1: Build Frontend
```powershell
cd frontend
npm run build
cd ..
```

### Step 2: Start Backend in Production Mode
```powershell
# Set environment variable (PowerShell syntax)
$env:NODE_ENV="production"
cd backend
npm start
```

Or in one line:
```powershell
$env:NODE_ENV="production"; cd backend; npm start
```

---

## ✅ Use the Test Script

```powershell
.\test-production.ps1
```

---

## ✅ Check if Build Worked

After building, check if dist folder exists:

```powershell
Test-Path frontend/dist/index.html
# Should return: True
```

---

## 🌐 Test in Browser

After starting the server, visit:
- **http://localhost:3000** - Should show your React homepage ✅
- **http://localhost:3000/health** - Should show `{"status":"ok"}` ✅

If you see the homepage, it means:
- ✅ Frontend build works
- ✅ Static file serving works
- ✅ Should work on Render too!

---

## ⚠️ If You See API Message Instead

If you see `{"success":true,"message":"API server is running"}`:
- ❌ Check if `frontend/dist` folder exists
- ❌ Check backend logs for "Static files not found"
- ❌ Make sure you built the frontend first

---

## 🔧 Troubleshooting

**Error: "cross-env is not recognized"**
- Solution: Use PowerShell syntax instead: `$env:NODE_ENV="production"`

**Error: "dist folder not found"**
- Solution: Run `npm run build` first

**Error: "Port 3000 already in use"**
- Solution: Stop other servers or change port in `.env`

