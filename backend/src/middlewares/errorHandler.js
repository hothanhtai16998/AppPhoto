import { AppError } from '../utils/errors.js';
import { env } from '../libs/env.js';
import { logger } from '../utils/logger.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        url: req.originalUrl,
        method: req.method,
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || 'field';
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        error = new AppError(message, 409);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new AppError(message, 400);
    }

    // JSON parsing error
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        const message = 'Invalid JSON in request body';
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new AppError(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new AppError(message, 401);
    }

    // Default to 500 server error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

/**
 * Catch async errors wrapper
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

