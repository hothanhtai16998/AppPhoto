# 🚀 Quick Deployment Guide

## Prerequisites Setup (5 minutes)

### 1. MongoDB Atlas (Free)
- Go to https://www.mongodb.com/cloud/atlas
- Sign up / Log in
- Click "Build a Database" → Select FREE tier
- Choose cloud provider & region → Create cluster
- Create Database User:
  - Username: `appphoto` (or any)
  - Password: Generate or create strong password
  - Click "Add User"
- Network Access:
  - Click "Add IP Address"
  - Click "Allow Access from Anywhere" (0.0.0.0/0)
  - Click "Confirm"
- Get Connection String:
  - Click "Connect" → "Connect your application"
  - Copy the connection string
  - Replace `<password>` with your database password
  - Example: `mongodb+srv://appphoto:yourpassword@cluster0.xxxxx.mongodb.net/appphoto?retryWrites=true&w=majority`

### 2. Cloudinary (Free)
- Go to https://cloudinary.com/
- Sign up / Log in
- Go to Dashboard
- Copy these values:
  - Cloud Name
  - API Key
  - API Secret

### 3. Generate JWT Secret
Run this command or use any random string (32+ characters):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Deploy to Render.com (Recommended - Easiest)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository
5. Configure:
   - **Name:** `appphoto` (or any)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or Paid)

### Step 3: Add Environment Variables
Click "Environment" tab and add:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_connection_string_here
ACCESS_TOKEN_SECRET=your_jwt_secret_here
CLIENT_URL=https://your-app.onrender.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Important:** Replace `CLIENT_URL` with your actual Render URL after first deployment!

### Step 4: Deploy
- Click **"Create Web Service"**
- Wait 5-10 minutes for deployment
- Your app will be live at `https://your-app.onrender.com`

### Step 5: Update CLIENT_URL
After deployment:
1. Copy your Render URL (e.g., `https://appphoto-xxxx.onrender.com`)
2. Go to Environment variables
3. Update `CLIENT_URL` to your Render URL
4. Redeploy (Render auto-redeploys on env var changes)

---

## Alternative: Deploy Separately

### Backend on Render
Same as above, but:
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- Add `DISABLE_STATIC_FILES=true` to env vars

### Frontend on Vercel
1. Go to https://vercel.com/
2. Import GitHub repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
5. Deploy

---

## Verification Checklist

After deployment:
- [ ] Backend is accessible: `https://your-app.onrender.com/health`
- [ ] API works: `https://your-app.onrender.com/api/auth/signup` (POST)
- [ ] Frontend loads: `https://your-app.onrender.com/`
- [ ] Can sign up
- [ ] Can sign in
- [ ] Can upload images

---

## Troubleshooting

**Build fails:**
- Check logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node version (should be 18+)

**MongoDB connection fails:**
- Check IP whitelist (should allow 0.0.0.0/0)
- Verify connection string has correct password
- Check database user has read/write permissions

**CORS errors:**
- Ensure `CLIENT_URL` matches your frontend URL exactly
- Include `https://` protocol
- No trailing slash

**Static files not found:**
- Ensure `npm run build` completes successfully
- Check `frontend/dist` folder exists
- Try setting `DISABLE_STATIC_FILES=true` if deploying separately

---

## Need Help?

Check full documentation in `DEPLOYMENT.md` or open an issue on GitHub.

