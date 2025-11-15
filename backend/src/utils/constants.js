/**
 * Application constants
 */

export const TOKEN_CONFIG = {
    ACCESS_TOKEN_TTL: '30m',
    REFRESH_TOKEN_TTL: 14 * 24 * 60 * 60 * 1000, // 14 days
    REFRESH_TOKEN_LENGTH: 64,
};

export const PASSWORD_CONFIG = {
    MIN_LENGTH: 8,
    SALT_ROUNDS: 10,
};

export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10 MB
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
};

export const VALIDATION = {
    USERNAME_MIN_LENGTH: 6,
    USERNAME_MAX_LENGTH: 30,
    DISPLAY_NAME_MIN_LENGTH: 2,
    DISPLAY_NAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100,
    BIO_MAX_LENGTH: 500,
    TITLE_MAX_LENGTH: 200,
    LOCATION_MAX_LENGTH: 100,
    CAMERA_MODEL_MAX_LENGTH: 100,
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

