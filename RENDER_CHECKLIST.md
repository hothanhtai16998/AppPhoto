# ✅ Render Deployment Checklist

Follow this checklist step by step to deploy your app to Render.

## 📋 Pre-Deployment Setup

### Step 1: MongoDB Atlas (5 minutes)

- [ ] 1. Go to https://www.mongodb.com/cloud/atlas/register
- [ ] 2. Create FREE account
- [ ] 3. Click "Build a Database" → Select FREE tier
- [ ] 4. Create database user:
     - Username: `appphoto`
     - Password: **COPY AND SAVE THIS PASSWORD!**
- [ ] 5. Network Access: Click "Allow Access from Anywhere" (0.0.0.0/0)
- [ ] 6. Get connection string:
     - Click "Connect" → "Connect your application"
     - Copy string, replace `<password>` with your password
     - **Save this:** `mongodb+srv://appphoto:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/appphoto?retryWrites=true&w=majority`

### Step 2: Cloudinary (2 minutes)

- [ ] 1. Go to https://cloudinary.com/users/register/free
- [ ] 2. Create FREE account
- [ ] 3. Go to Dashboard
- [ ] 4. Copy these 3 values:
     - Cloud Name: `_________________`
     - API Key: `_________________`
     - API Secret: `_________________`

### Step 3: Generate JWT Secret

- [ ] Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Copy the output: `_________________`

### Step 4: Push to GitHub

- [ ] Run these commands:
     ```bash
     git add .
     git commit -m "Ready for Render deployment"
     git push origin main
     ```

---

## 🚀 Deploy on Render

### Step 5: Create Render Account

- [ ] 1. Go to https://dashboard.render.com/
- [ ] 2. Click "Get Started for Free"
- [ ] 3. Sign up with GitHub (easiest)

### Step 6: Create Web Service

- [ ] 1. Click "New +" → "Web Service"
- [ ] 2. Connect GitHub (if not already)
- [ ] 3. Select repository: `AppPhoto`
- [ ] 4. Click "Connect"

### Step 7: Configure Service

Fill in these EXACT settings:

- [ ] **Name:** `appphoto` (or any name)
- [ ] **Region:** Choose closest (Singapore, Oregon, etc.)
- [ ] **Branch:** `main`
- [ ] **Root Directory:** *(leave empty)*
- [ ] **Environment:** `Node`
- [ ] **Build Command:** `npm run build`
- [ ] **Start Command:** `npm start`
- [ ] **Instance Type:** `Free`

### Step 8: Add Environment Variables

Go to "Environment" tab and add these **8 variables**:

1. [ ] `NODE_ENV` = `production`
2. [ ] `PORT` = `3000`
3. [ ] `MONGODB_URI` = *(paste your MongoDB connection string)*
4. [ ] `ACCESS_TOKEN_SECRET` = *(paste your JWT secret)*
5. [ ] `CLIENT_URL` = `https://appphoto.onrender.com` *(we'll update this later)*
6. [ ] `CLOUDINARY_CLOUD_NAME` = *(paste cloud name)*
7. [ ] `CLOUDINARY_API_KEY` = *(paste API key)*
8. [ ] `CLOUDINARY_API_SECRET` = *(paste API secret)*

### Step 9: Deploy

- [ ] 1. Scroll down and click **"Create Web Service"**
- [ ] 2. Wait 5-10 minutes
- [ ] 3. Watch the logs
- [ ] 4. Wait until status says **"Live"** ✅

### Step 10: Update CLIENT_URL

After deployment completes:

- [ ] 1. Copy your Render URL from top of dashboard (e.g., `https://appphoto-xxxx.onrender.com`)
- [ ] 2. Go to "Environment" tab
- [ ] 3. Edit `CLIENT_URL` variable
- [ ] 4. Replace with your actual Render URL
- [ ] 5. Save (it will auto-redeploy)

---

## ✅ Test Your Deployment

- [ ] Visit: `https://your-app.onrender.com/health`
  - Should show: `{"status":"ok","timestamp":"..."}`

- [ ] Visit: `https://your-app.onrender.com/`
  - Should show your app or API info

- [ ] Try signing up
- [ ] Try signing in
- [ ] Try uploading an image

---

## 🎉 Done!

Your app is now live at: `https://your-app-name.onrender.com`

---

## 📝 Quick Reference

**Your Render URL:** `________________________________________`

**All Environment Variables:**
```
NODE_ENV=production
PORT=3000
MONGODB_URI=________________________________________
ACCESS_TOKEN_SECRET=________________________________________
CLIENT_URL=________________________________________
CLOUDINARY_CLOUD_NAME=________________________________________
CLOUDINARY_API_KEY=________________________________________
CLOUDINARY_API_SECRET=________________________________________
```

---

## ❌ Troubleshooting

**Problem:** Build fails
**Solution:** Check logs, make sure all env vars are set

**Problem:** MongoDB connection fails
**Solution:** Check MongoDB Atlas → Network Access allows 0.0.0.0/0

**Problem:** CORS errors
**Solution:** Update CLIENT_URL to match your exact Render URL

**Problem:** Service sleeps (free tier)
**Solution:** First request after 15 min takes 30-60 sec (normal for free tier)

