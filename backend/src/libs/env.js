import 'dotenv/config';

/**
 * Required environment variables
 */
const requiredEnvVars = [
	'MONGODB_URI',
	'ACCESS_TOKEN_SECRET',
	'CLIENT_URL',
	'CLOUDINARY_CLOUD_NAME',
	'CLOUDINARY_API_KEY',
	'CLOUDINARY_API_SECRET',
];

/**
 * Validate required environment variables
 */
const validateEnv = () => {
	const missing = requiredEnvVars.filter(
		(varName) => !process.env[varName]
	);

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(', ')}`
		);
	}
};

// Validate on import
validateEnv();

export const env = {
	PORT: process.env.PORT || 3000,
	MONGODB_URI: process.env.MONGODB_URI,
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
	CLIENT_URL: process.env.CLIENT_URL,
	NODE_ENV: process.env.NODE_ENV || 'development',
	RESEND_API_KEY: process.env.RESEND_API_KEY,
	EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
	EMAIL_FROM: process.env.EMAIL_FROM,
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
	ARCJET_KEY: process.env.ARCJET_KEY,
	ARCJET_ENV: process.env.ARCJET_ENV,
};