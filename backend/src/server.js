import express from 'express';
import { env } from './libs/env.js';
import { CONNECT_DB } from './configs/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js';
import { protectedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';
import imageRoute from './routes/imageRoute.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './utils/logger.js';
import 'dotenv/config';

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = env.PORT;

// Security middleware
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware with error handling
app.use(express.json({
    limit: '10mb',
    strict: true,
    type: 'application/json'
}));
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            error: 'Invalid JSON in request body'
        });
    }
    next(err);
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint (before catch-all routes)
app.get('/health', (_, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/users', protectedRoute, userRoute);
app.use('/api/images', protectedRoute, imageRoute);

// Serve static files in production (only if dist folder exists)
if (env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../frontend/dist');
    const indexPath = path.join(distPath, 'index.html');

    if (existsSync(distPath) && existsSync(indexPath)) {
        app.use(express.static(distPath));

        // Serve index.html for all non-API routes (must be last)
        app.get('*', (req, res, next) => {
            // Skip if this is an API route
            if (req.path.startsWith('/api')) {
                return next();
            }
            res.sendFile(indexPath);
        });

        logger.info('Static files are being served from:', distPath);
    } else {
        logger.warn('Static files not found. Skipping static file serving.');
        logger.warn('Expected path:', distPath);

        // If static files don't exist, provide a helpful message for root route
        app.get('/', (_, res) => {
            res.status(404).json({
                success: false,
                error: 'Frontend build not found. Please ensure the frontend is built and deployed correctly.',
            });
        });
    }
}

// Global error handler (must be last)
app.use(errorHandler);

// Start server and connect to database
const startServer = async () => {
    try {
        await CONNECT_DB();
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    // Close server gracefully
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

startServer();
