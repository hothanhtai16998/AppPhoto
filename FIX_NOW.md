# 🔧 Fix: API-Only Mode Issue

You're seeing `(API-only mode)` which means **either**:

1. ❌ `DISABLE_STATIC_FILES=true` is set in environment variables (Render or local)
2. ❌ Frontend build doesn't exist or wasn't found
3. ❌ Testing locally but didn't set `NODE_ENV=production`

---

## ✅ Quick Fix Steps

### Step 1: Build Frontend (If Testing Locally)

```powershell
cd frontend
npm run build
cd ..
```

### Step 2: Check Where You're Testing

**Are you testing on Render (deployed) or locally?**

- **Render**: Go to Step 3 (Fix Render)
- **Local**: Go to Step 4 (Fix Local)

---

## 🌐 Step 3: Fix Render Deployment

### Option A: Remove DISABLE_STATIC_FILES (Most Common Fix)

1. Go to **Render Dashboard** → Your Service
2. Click **"Environment"** tab
3. Look for `DISABLE_STATIC_FILES`
4. **If it exists:**
   - Click the pencil icon (✏️) to edit
   - **Delete it completely** or set value to `false`
   - Click **"Save Changes"**
   - Wait 2-3 minutes for redeploy
5. Visit your site again

### Option B: Check Build Logs

1. Go to **Render Dashboard** → Your Service
2. Click **"Logs"** tab
3. Scroll to **build logs** (top section)
4. Look for:
   - ✅ `✓ built in XXs` (frontend build succeeded)
   - ❌ `Error building frontend` (build failed)
5. If build failed, fix the errors shown

### Option C: Check Runtime Logs

1. Go to **"Logs"** tab
2. Scroll to **runtime logs** (bottom section)
3. Look for:
   - ✅ `Found static files at: ...` (Good!)
   - ❌ `⚠️ Static files not found` (Bad!)
   - `Tried paths: [...]` (Shows where it looked)

### Option D: Verify Render Settings

Go to **Settings** tab:

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Root Directory:** (leave **empty**)
- **Environment:** `Node`

---

## 💻 Step 4: Fix Local Testing

### Test Locally in Production Mode

```powershell
# 1. Build frontend
cd frontend
npm run build
cd ..

# 2. Start backend in production mode
$env:NODE_ENV="production"
cd backend
npm start
```

Then visit: **http://localhost:3000**

You should see your homepage, not the API message.

### If You Still See API Message Locally

1. **Check if dist exists:**
   ```powershell
   Test-Path frontend/dist/index.html
   # Should return: True
   ```

2. **Check environment variable:**
   ```powershell
   $env:DISABLE_STATIC_FILES
   # Should return: nothing (not set) or "false"
   ```

3. **If DISABLE_STATIC_FILES is set to "true":**
   ```powershell
   Remove-Item Env:DISABLE_STATIC_FILES
   # Or set to false:
   $env:DISABLE_STATIC_FILES="false"
   ```

4. **Check backend logs** when starting:
   - Look for: `"Looking for static files..."`
   - Look for: `"Found static files at: ..."` or `"Static files not found"`

---

## 🔍 Debugging: What Message Shows What?

| Message | Meaning | Fix |
|---------|---------|-----|
| `"API server is running (API-only mode)"` | `DISABLE_STATIC_FILES=true` is set | Remove env var in Render |
| `"API server is running"` (with debug info) | Static files not found | Build frontend or fix paths |
| Your actual homepage | ✅ Working! | Nothing needed |

---

## 📋 Checklist

- [ ] Built frontend: `cd frontend && npm run build`
- [ ] `frontend/dist/index.html` exists
- [ ] `DISABLE_STATIC_FILES` is NOT set (or set to `false`)
- [ ] `NODE_ENV=production` when testing locally
- [ ] Render build logs show frontend build succeeded
- [ ] Render runtime logs show "Found static files at:"

---

## 🚀 Most Common Fix

**For Render:** Go to Environment tab → Remove `DISABLE_STATIC_FILES` → Redeploy

That's usually it! 🎉

