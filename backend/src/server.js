import express from 'express';
import { env } from './libs/env.js';
import { CONNECT_DB } from './configs/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
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

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/users', protectedRoute, userRoute);
app.use('/api/images', protectedRoute, imageRoute);

// Serve static files in production
if (env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

// Health check endpoint
app.get('/health', (_, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

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
