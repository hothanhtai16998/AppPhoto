/**
 * API Configuration Constants
 */
export const API_CONFIG = {
	BASE_URL:
		import.meta.env.MODE ===
		'development'
			? import.meta.env.VITE_API_URL ||
			  'http://localhost:3000/api'
			: '/api',
	ENDPOINTS: {
		AUTH: {
			SIGNUP: '/auth/signup',
			SIGNIN: '/auth/signin',
			SIGNOUT: '/auth/signout',
			REFRESH: '/auth/refresh',
		},
		USERS: {
			ME: '/users/me',
		},
		IMAGES: {
			BASE: '/images',
			UPLOAD: '/images/upload',
			BY_USER: (userId: string) =>
				`/images/user/${userId}`,
		},
	},
	MAX_RETRY_COUNT: 3,
	TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * HTTP Status Codes
 */
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
} as const;
