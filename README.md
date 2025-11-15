# AppPhoto

A full-stack photo sharing application built with React, Express, MongoDB, and Cloudinary.

## Features

- User authentication (sign up, sign in, sign out)
- Image upload and management
- Profile management
- Responsive design
- JWT-based authentication
- Image storage with Cloudinary

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Cloudinary for image storage
- Express Validator for input validation
- bcrypt for password hashing

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AppPhoto.git
   cd AppPhoto
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**

   Backend (create `backend/.env`):
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   Frontend (create `frontend/.env` - optional):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Run the application**

   Start backend:
   ```bash
   cd backend
   npm run dev
   ```

   Start frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

## Available Scripts

### Root
- `npm run build` - Build frontend and install dependencies
- `npm start` - Start production server

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

1. **Render.com** (Recommended for beginners)
   - Deploy everything together
   - See DEPLOYMENT.md for step-by-step guide

2. **Vercel + Railway**
   - Frontend on Vercel
   - Backend on Railway
   - Best for production apps

3. **Netlify + Render**
   - Frontend on Netlify
   - Backend on Render
   - Free tier available

## Project Structure

```
AppPhoto/
├── backend/
│   ├── src/
│   │   ├── configs/        # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── libs/           # Utilities (env, cloudinary)
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper utilities
│   │   └── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── constants/      # Constants (API config)
│   │   ├── lib/            # Utilities (axios)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── stores/         # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   └── main.tsx        # Entry point
│   └── package.json
└── package.json            # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users/me` - Get current user (protected)

### Images
- `GET /api/images` - Get all images (protected)
- `POST /api/images/upload` - Upload image (protected)
- `GET /api/images/user/:userId` - Get user images (protected)

### Health
- `GET /health` - Health check endpoint

## Environment Variables

See `DEPLOYMENT.md` for complete list of required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.

