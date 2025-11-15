# Deployment Guide

This guide covers deploying your AppPhoto application. You have multiple deployment options.

## Prerequisites

1. **MongoDB Database** - Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
2. **Cloudinary Account** - Sign up for [Cloudinary](https://cloudinary.com/) (free tier available)
3. **GitHub Repository** - Your code should be on GitHub

## Required Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` folder with:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appphoto?retryWrites=true&w=majority

# JWT Secret (generate a random string)
ACCESS_TOKEN_SECRET=your-super-secret-jwt-key-here-minimum-32-characters

# CORS
CLIENT_URL=https://your-frontend-domain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Optional: Disable static file serving if deploying separately
# DISABLE_STATIC_FILES=true
```

### Frontend Environment Variables (if deploying separately)

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=https://your-backend-api-domain.com/api
```

---

## Option 1: Deploy Everything Together (Recommended for Simple Deployment)

Deploy both backend and frontend on the same service (Render, Railway, Heroku).

### Using Render.com

1. **Create a Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** (leave empty, uses project root)

3. **Set Environment Variables**
   Add all backend environment variables from above.

4. **Deploy**
   - Render will automatically:
     - Install dependencies
     - Build the frontend (`npm run build` in frontend folder)
     - Start the backend server
     - Serve static files from `frontend/dist`

### Using Railway

1. **Create a New Project**
   - Go to [Railway](https://railway.app/)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   - Railway detects `package.json` automatically
   - Set build command: `npm run build`
   - Set start command: `npm start`

3. **Add Environment Variables**
   - Go to Variables tab
   - Add all backend environment variables

4. **Deploy**
   - Railway will deploy automatically

---

## Option 2: Deploy Separately (Recommended for Production)

Deploy backend and frontend on different services for better scalability.

### Backend Deployment (Render/Railway/Vercel)

#### Render.com (Backend)

1. **Create Web Service**
   - Repository: Your GitHub repo
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

2. **Environment Variables**
   Add all backend env vars, plus:
   ```env
   DISABLE_STATIC_FILES=true
   CLIENT_URL=https://your-frontend-domain.com
   ```

3. **Deploy**
   - Note the backend URL (e.g., `https://your-backend.onrender.com`)

#### Railway (Backend)

1. **Add Service**
   - Select "Empty Service"
   - Connect GitHub repo
   - Set **Root Directory:** `backend`

2. **Environment Variables**
   - Add all backend env vars

3. **Deploy**
   - Railway will detect and deploy

### Frontend Deployment (Vercel/Netlify)

#### Vercel (Recommended for Frontend)

1. **Import Project**
   - Go to [Vercel](https://vercel.com/)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy**
   - Vercel will build and deploy automatically

#### Netlify

1. **New Site from Git**
   - Connect GitHub repository
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

2. **Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. **Deploy**

---

## Step-by-Step Deployment (Render Example)

### 1. Prepare MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for Render, or specific IP)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### 2. Prepare Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 3. Deploy to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Web Service**
   - Connect GitHub repo
   - Settings:
     - **Name:** appphoto
     - **Region:** Choose closest to you
     - **Branch:** main
     - **Root Directory:** (leave empty)
     - **Environment:** Node
     - **Build Command:** `npm run build`
     - **Start Command:** `npm start`

3. **Add Environment Variables**
   - Click "Environment" tab
   - Add all variables from the list above

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your app will be live at `https://your-service.onrender.com`

### 4. Update Frontend API URL (if deploying separately)

If deploying frontend separately, update `frontend/src/constants/api.ts`:

```typescript
export const API_CONFIG = {
	BASE_URL:
		import.meta.env.MODE === 'development'
			? import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
			: import.meta.env.VITE_API_URL || '/api',  // Use env var in production
	// ...
}
```

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] MongoDB connection is working
- [ ] Cloudinary uploads are working
- [ ] Frontend can connect to backend API
- [ ] Environment variables are set correctly
- [ ] CORS is configured with correct frontend URL
- [ ] HTTPS is enabled (most platforms do this automatically)
- [ ] Test sign up, sign in, image upload

---

## Troubleshooting

### Backend Issues

**Error: Missing required environment variables**
- Make sure all required env vars are set in your deployment platform

**Error: Cannot connect to MongoDB**
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for cloud platforms)
- Verify connection string is correct
- Check database user has proper permissions

**Error: Static files not found**
- If deploying together: Ensure `npm run build` runs before `npm start`
- If deploying separately: Set `DISABLE_STATIC_FILES=true`

### Frontend Issues

**Error: Cannot connect to backend**
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend (CLIENT_URL should match frontend domain)
- Verify backend URL is accessible

**Error: CORS errors**
- Update backend `CLIENT_URL` env var to match your frontend domain
- Include protocol (https://) and no trailing slash

---

## Quick Deploy Commands

### Local Testing

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Build for Production

```bash
# Build everything
npm run build

# Start production server
npm start
```

---

## Recommended Deployment Platform Combinations

1. **Simple/Personal Projects:** Render (everything together)
2. **Production Apps:** 
   - Backend: Render/Railway
   - Frontend: Vercel/Netlify
3. **Enterprise:** AWS/Azure/GCP (more complex setup)

---

## Security Notes

- **Never commit `.env` files** to Git
- Use strong, random `ACCESS_TOKEN_SECRET` (32+ characters)
- Enable HTTPS only (most platforms do this automatically)
- Keep MongoDB credentials secure
- Regularly update dependencies

---

For more help, check your deployment platform's documentation or contact support.

