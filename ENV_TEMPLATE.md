# Environment Variables Template

Copy these values and fill them in for Render deployment:

## Backend Environment Variables (Render)

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/appphoto?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=generate_with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CLIENT_URL=https://your-app-name.onrender.com
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## How to Get Each Value:

### MONGODB_URI
1. Go to MongoDB Atlas
2. Click "Connect" → "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `appphoto`

### ACCESS_TOKEN_SECRET
Run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output

### CLIENT_URL
After first deployment:
- Copy your Render URL
- Example: `https://appphoto-xxxx.onrender.com`
- Update in Render dashboard after deployment

### Cloudinary Values
1. Go to https://cloudinary.com/console
2. Dashboard shows:
   - Cloud Name
   - API Key
   - API Secret

---

## Quick Copy Checklist

When deploying, you need these 7 values:
1. ✅ MONGODB_URI (from MongoDB Atlas)
2. ✅ ACCESS_TOKEN_SECRET (generate with Node command)
3. ✅ CLIENT_URL (from Render after first deploy)
4. ✅ CLOUDINARY_CLOUD_NAME (from Cloudinary dashboard)
5. ✅ CLOUDINARY_API_KEY (from Cloudinary dashboard)
6. ✅ CLOUDINARY_API_SECRET (from Cloudinary dashboard)
7. ✅ NODE_ENV=production (always use this)
8. ✅ PORT=3000 (optional, defaults to 3000)

