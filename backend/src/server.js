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
// You can disable this by setting DISABLE_STATIC_FILES=true in your .env
if (env.NODE_ENV === 'production' && !process.env.DISABLE_STATIC_FILES) {
    // Try multiple possible paths for dist folder
    const possiblePaths = [
        path.join(__dirname, '../frontend/dist'),           // Local development/deployment
        path.join(__dirname, '../../frontend/dist'),        // Render/monorepo structure
        path.join(process.cwd(), 'frontend/dist'),          // From project root
    ];

    let distPath = null;
    let indexPath = null;

    // Find the first existing dist folder
    for (const possiblePath of possiblePaths) {
        const possibleIndexPath = path.join(possiblePath, 'index.html');
        if (existsSync(possiblePath) && existsSync(possibleIndexPath)) {
            distPath = possiblePath;
            indexPath = possibleIndexPath;
            break;
        }
    }

    if (distPath && indexPath) {
        app.use(express.static(distPath));

        // Serve index.html for all non-API routes (must be last)
        app.get('*', (req, res, next) => {
            // Skip if this is an API route or health check
            if (req.path.startsWith('/api') || req.path === '/health') {
                return next();
            }
            res.sendFile(indexPath);
        });

        logger.info('Static files are being served from:', distPath);
    } else {
        logger.warn('Static files not found. Running in API-only mode.');
        logger.warn('Tried paths:', possiblePaths);

        // If static files don't exist, provide helpful API info for root route
        app.get('/', (_, res) => {
            res.status(200).json({
                success: true,
                message: 'API server is running',
                version: '1.0.0',
                endpoints: {
                    health: '/health',
                    auth: '/api/auth',
                    users: '/api/users',
                    images: '/api/images',
                },
                note: 'Frontend build not found. This is API-only mode. To serve static files, ensure the frontend is built and placed in the correct location.',
            });
        });
    }
} else if (env.NODE_ENV === 'production' && process.env.DISABLE_STATIC_FILES) {
    logger.info('Static file serving is disabled via DISABLE_STATIC_FILES environment variable.');

    // Provide API info for root route when static files are disabled
    app.get('/', (_, res) => {
        res.status(200).json({
            success: true,
            message: 'API server is running (API-only mode)',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                auth: '/api/auth',
                users: '/api/users',
                images: '/api/images',
            },
        });
    });
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
