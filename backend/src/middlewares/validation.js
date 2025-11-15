import { body, validationResult } from 'express-validator';
import { asyncHandler } from './errorHandler.js';
import { ValidationError } from '../utils/errors.js';
import { VALIDATION, PASSWORD_CONFIG } from '../utils/constants.js';

/**
 * Validation result handler
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
    }
    next();
};

/**
 * User registration validation
 */
export const validateSignUp = [
    body('username')
        .trim()
        .isLength({ min: VALIDATION.USERNAME_MIN_LENGTH, max: VALIDATION.USERNAME_MAX_LENGTH })
        .withMessage(`Username must be between ${VALIDATION.USERNAME_MIN_LENGTH} and ${VALIDATION.USERNAME_MAX_LENGTH} characters`)
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .toLowerCase(),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: VALIDATION.EMAIL_MAX_LENGTH })
        .withMessage(`Email must be at most ${VALIDATION.EMAIL_MAX_LENGTH} characters`)
        .normalizeEmail(),
    body('password')
        .isLength({ min: PASSWORD_CONFIG.MIN_LENGTH })
        .withMessage(`Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters long`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: VALIDATION.DISPLAY_NAME_MIN_LENGTH, max: VALIDATION.DISPLAY_NAME_MAX_LENGTH })
        .withMessage(`First name must be between ${VALIDATION.DISPLAY_NAME_MIN_LENGTH} and ${VALIDATION.DISPLAY_NAME_MAX_LENGTH} characters`),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: VALIDATION.DISPLAY_NAME_MIN_LENGTH, max: VALIDATION.DISPLAY_NAME_MAX_LENGTH })
        .withMessage(`Last name must be between ${VALIDATION.DISPLAY_NAME_MIN_LENGTH} and ${VALIDATION.DISPLAY_NAME_MAX_LENGTH} characters`),
    validate,
];

/**
 * User login validation
 */
export const validateSignIn = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate,
];

/**
 * Image upload validation
 */
export const validateImageUpload = [
    body('imageTitle')
        .trim()
        .notEmpty()
        .withMessage('Image title is required')
        .isLength({ max: VALIDATION.TITLE_MAX_LENGTH })
        .withMessage(`Image title must be at most ${VALIDATION.TITLE_MAX_LENGTH} characters`),
    body('imageCategory')
        .trim()
        .notEmpty()
        .withMessage('Image category is required'),
    body('location')
        .optional()
        .trim()
        .isLength({ max: VALIDATION.LOCATION_MAX_LENGTH })
        .withMessage(`Location must be at most ${VALIDATION.LOCATION_MAX_LENGTH} characters`),
    body('cameraModel')
        .optional()
        .trim()
        .isLength({ max: VALIDATION.CAMERA_MODEL_MAX_LENGTH })
        .withMessage(`Camera model must be at most ${VALIDATION.CAMERA_MODEL_MAX_LENGTH} characters`),
    validate,
];

