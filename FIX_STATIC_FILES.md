# Fix: Why You See API Message Instead of Homepage

You're seeing the API message because the backend can't find the frontend `dist` folder.

## Quick Fix Options

### Option 1: Check Render Build Logs (Recommended)

1. Go to your Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for these messages:
   - `"Static files not found. Running in API-only mode."`
   - `"Tried paths:"` - This shows what paths were checked
   - Build logs - Make sure frontend build completed successfully

### Option 2: Make Sure Build Runs

The build command should create `frontend/dist` folder. Check:

1. In Render, go to your service settings
2. Verify **Build Command:** `npm run build`
3. Check build logs to ensure:
   - Frontend build completes
   - No errors during `npm run build --prefix frontend`
   - `frontend/dist` folder is created

### Option 3: Check Environment Variables

In Render dashboard → Environment tab, check if:
- `DISABLE_STATIC_FILES` is set to `true` (if yes, remove it or set to `false`)
- `NODE_ENV` is set to `production`

### Option 4: Update Render Build Settings

If build isn't creating dist correctly, try these settings in Render:

**Build Command:**
```bash
npm install && cd frontend && npm install && npm run build && cd ..
```

**Or use the root package.json script:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

### Option 5: Check File Structure on Render

After deployment, check Render logs for:
```
Current working directory: /opt/render/project/src
__dirname: /opt/render/project/src/backend/src
Tried paths: [...]
```

This will show you where the server is looking and what paths exist.

---

## Most Common Issues:

1. **Build doesn't create dist folder**
   - Fix: Check frontend build logs for errors
   - Make sure TypeScript compiles without errors

2. **DISABLE_STATIC_FILES is set**
   - Fix: Remove or set to `false` in Render environment variables

3. **Wrong working directory**
   - Fix: The improved code now tries 6 different paths, should work

4. **Build succeeds but dist is in wrong location**
   - Fix: The path detection should find it now

---

## Test Locally First

Before deploying, test locally:

```bash
# Build frontend
cd frontend
npm run build

# Start backend (should serve static files)
cd ../backend
NODE_ENV=production npm start
```

Then visit `http://localhost:3000` - you should see your homepage.

If this works locally but not on Render, the issue is with Render's build process or file structure.

---

## Next Steps:

1. Check Render build logs
2. Verify `frontend/dist` exists after build
3. Check environment variables (especially `DISABLE_STATIC_FILES`)
4. Share the logs with me if you need more help

