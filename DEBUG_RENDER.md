# 🔍 Debug: Why Static Files Aren't Being Found on Render

## Step 1: Check Render Logs

1. Go to **Render Dashboard** → Your Service
2. Click **"Logs"** tab
3. Scroll to **runtime logs** (bottom section)
4. Look for these messages:

### What to Look For:

```
Looking for static files...
Current working directory: /opt/render/project/src
__dirname: /opt/render/project/src/backend/src
NODE_ENV: production
DISABLE_STATIC_FILES: not set
Checking: /opt/render/project/src/frontend/dist
  - dist folder exists: true/false
  - index.html exists: true/false
```

### If you see "Static files not found":

You'll also see:
```
⚠️ Static files not found. Running in API-only mode.
Tried paths: [...]
```

This shows **exactly** which paths were checked and whether they exist.

---

## Step 2: Check Build Logs

1. Go to **"Logs"** tab
2. Scroll to **build logs** (top section)
3. Look for:

### Good Signs ✅:
```
> npm run build
> npm run install:all && npm run build --prefix frontend
...
✓ built in XXs
```

### Bad Signs ❌:
```
Error building frontend
TypeScript errors
Missing dependencies
```

---

## Step 3: Visit Your Site and Check Debug Info

Visit your site (e.g., `https://your-app.onrender.com/`)

You should see a JSON response with `debug` section:

```json
{
  "success": true,
  "message": "API server is running",
  "debug": {
    "cwd": "/opt/render/project/src",
    "__dirname": "/opt/render/project/src/backend/src",
    "nodeEnv": "production",
    "disableStaticFiles": "not set",
    "triedPaths": [
      {
        "path": "/opt/render/project/src/frontend/dist",
        "distExists": false,
        "indexExists": false
      },
      ...
    ]
  }
}
```

**This shows exactly:**
- Where the server is running from
- What paths were checked
- Whether each path exists

---

## Common Issues and Fixes

### Issue 1: Frontend Build Failed

**Symptoms:**
- Build logs show errors
- `frontend/dist` doesn't exist after build

**Fix:**
1. Check build logs for errors
2. Fix TypeScript/build errors
3. Make sure all dependencies are installed

### Issue 2: Dist Folder in Wrong Location

**Symptoms:**
- Build succeeds
- But dist folder is in unexpected location
- All `triedPaths` show `distExists: false`

**Fix:**
The improved code now checks 7 different paths. If none work, the `triedPaths` will show where it looked.

### Issue 3: Build Command Doesn't Run

**Symptoms:**
- No build logs
- Frontend never gets built

**Fix:**
1. Go to Render **Settings**
2. Verify **Build Command:** `npm run build`
3. Make sure it's running from project root (not `backend` folder)

### Issue 4: NODE_ENV Not Production

**Symptoms:**
- Logs show `NODE_ENV: development`
- Static files code doesn't run

**Fix:**
1. Go to Render **Environment** tab
2. Set `NODE_ENV=production`
3. Redeploy

---

## Quick Fix Checklist

- [ ] Check Render **Environment** tab:
  - `NODE_ENV=production` ✅
  - `DISABLE_STATIC_FILES` is NOT set (or set to `false`) ✅

- [ ] Check Render **Settings**:
  - **Build Command:** `npm run build` ✅
  - **Start Command:** `npm start` ✅
  - **Root Directory:** (leave empty) ✅

- [ ] Check Build Logs:
  - Frontend build completes successfully ✅
  - No errors ✅

- [ ] Check Runtime Logs:
  - Look for `"Looking for static files..."` ✅
  - Check `triedPaths` to see what was checked ✅

- [ ] Visit site and check `debug` info:
  - See what paths were tried ✅
  - See if any paths exist ✅

---

## Next Steps

1. **Commit and push these changes** (improved logging)
2. **Redeploy on Render**
3. **Check the logs** for the new detailed path information
4. **Share the logs** with me if you still need help

The improved code will now:
- Check paths in better order (project root first)
- Show detailed logging for each path checked
- Include debug info in the API response

This will help us identify the exact issue! 🎯

