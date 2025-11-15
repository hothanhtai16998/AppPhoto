# 🔧 Fix: Why You See API Message Instead of Homepage

You're seeing `{"success":true,"message":"API server is running (API-only mode)"}` because the backend can't find your frontend build files.

## Quick Diagnostic

The message shows `(API-only mode)` which means either:
1. ❌ `DISABLE_STATIC_FILES=true` is set in Render environment variables
2. ❌ The `frontend/dist` folder doesn't exist after build
3. ❌ The build failed silently

---

## ✅ Solution 1: Check Render Environment Variables

1. Go to **Render Dashboard** → Your Service
2. Click **"Environment"** tab
3. Look for `DISABLE_STATIC_FILES` variable
4. **If it exists:**
   - Click the pencil icon (edit)
   - Delete it or change value to `false`
   - Click "Save Changes"
   - Wait for redeploy (2-3 minutes)

---

## ✅ Solution 2: Check Build Logs

1. In Render, go to **"Logs"** tab
2. Scroll to the **build logs** (top part)
3. Look for:
   - `✓ built in XXs` - means frontend build succeeded
   - Any errors about TypeScript or build failures
4. **If build failed:**
   - Fix the errors shown in logs
   - Redeploy

---

## ✅ Solution 3: Verify Build Creates Dist Folder

The build command should create `frontend/dist/index.html`. Check logs for:

**Good signs:**
- `frontend/dist/index.html created`
- `✓ frontend build completed`
- No build errors

**Bad signs:**
- `Error building frontend`
- TypeScript errors
- Missing dependencies

---

## ✅ Solution 4: Check Runtime Logs

After deployment, check the **runtime logs** (bottom part of Logs tab) for:

**Looking for static files:**
- `Looking for static files...`
- `Current working directory: /opt/render/project/src`
- `Found static files at: ...` ✅ (Good!)
- `⚠️ Static files not found` ❌ (Bad!)

If you see "Static files not found", it will also show:
- `Tried paths: [...]` - This shows what paths were checked

---

## ✅ Solution 5: Update Render Build Settings

If the build isn't working, try this in Render settings:

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

**Make sure:**
- Root Directory is **empty** (not set to `backend`)
- Build Command runs from project root

---

## ✅ Solution 6: Manual Fix - Force Rebuild

If nothing works:

1. In Render, go to **"Manual Deploy"**
2. Click **"Deploy latest commit"**
3. Watch the logs carefully
4. Check if frontend build completes
5. Check if dist folder is created

---

## 🔍 What to Check in Render Logs

Look for these messages in order:

1. **Build phase:**
   ```
   > npm run build
   > Building frontend...
   ✓ frontend built successfully
   ```

2. **Runtime phase:**
   ```
   Looking for static files...
   Current working directory: /opt/render/project/src
   Found static files at: /opt/render/project/src/frontend/dist  ✅
   ```

If you see:
```
⚠️ Static files not found. Running in API-only mode.
Tried paths: [...]
```

This means the dist folder exists but wasn't found. Check the paths tried.

---

## 📋 Checklist

- [ ] `DISABLE_STATIC_FILES` is NOT set (or set to `false`)
- [ ] Frontend build completes successfully (check build logs)
- [ ] `frontend/dist/index.html` exists after build
- [ ] Build command is: `npm run build`
- [ ] Start command is: `npm start`
- [ ] Root Directory is empty (not `backend`)
- [ ] No errors in build logs

---

## 🚀 Quick Fix Steps

1. **Check Environment Variables:**
   - Remove or set `DISABLE_STATIC_FILES=false`
   - Make sure `NODE_ENV=production`

2. **Check Build Logs:**
   - Verify frontend build succeeds
   - Look for "dist" folder creation

3. **Redeploy:**
   - Click "Manual Deploy" → "Deploy latest commit"
   - Watch logs carefully

4. **Check Runtime Logs:**
   - Look for "Found static files at:"
   - Should see your homepage, not API message

---

## Still Not Working?

Share these from Render logs:
1. Build logs (the part about frontend build)
2. Runtime logs (the part about "Looking for static files")
3. What paths were tried (from the error message)

Then I can help debug further!

