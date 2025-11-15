import { useAuthStore } from '@/stores/useAuthStore';
import axios, {
	AxiosError,
} from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import {
	API_CONFIG,
	HTTP_STATUS,
} from '@/constants/api';
import type { ApiError } from '@/types/api';

const api = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	withCredentials: true,
	timeout: API_CONFIG.TIMEOUT,
	headers: {
		'Content-Type': 'application/json',
	},
});

/**
 * Request interceptor - Attach access token to request headers
 */
api.interceptors.request.use(
	(
		config: InternalAxiosRequestConfig
	) => {
		const { accessToken } =
			useAuthStore.getState();

		if (accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

/**
 * Response interceptor - Handle token refresh and error handling
 */
api.interceptors.response.use(
	(response) => response,
	async (
		error: AxiosError<ApiError>
	) => {
		const originalRequest =
			error.config as InternalAxiosRequestConfig & {
				_retry?: boolean;
				_retryCount?: number;
			};

		// Skip token refresh for auth endpoints
		const authEndpoints = [
			API_CONFIG.ENDPOINTS.AUTH.SIGNIN,
			API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
			API_CONFIG.ENDPOINTS.AUTH.REFRESH,
		];

		if (
			originalRequest?.url &&
			authEndpoints.some((endpoint) =>
				originalRequest.url?.includes(
					endpoint
				)
			)
		) {
			return Promise.reject(error);
		}

		// Handle 401/403 errors - token expired or invalid
		if (
			error.response &&
			(error.response.status ===
				HTTP_STATUS.UNAUTHORIZED ||
				error.response.status ===
					HTTP_STATUS.FORBIDDEN) &&
			originalRequest &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			originalRequest._retryCount =
				(originalRequest._retryCount ||
					0) + 1;

			// Limit retry attempts
			if (
				originalRequest._retryCount >
				API_CONFIG.MAX_RETRY_COUNT
			) {
				useAuthStore
					.getState()
					.clearState();
				return Promise.reject(error);
			}

			try {
				const response = await api.post(
					API_CONFIG.ENDPOINTS.AUTH
						.REFRESH,
					null,
					{
						withCredentials: true,
					}
				);
				const newAccessToken =
					response.data.accessToken;

				if (newAccessToken) {
					useAuthStore
						.getState()
						.setAccessToken(
							newAccessToken
						);

					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					}

					return api(originalRequest);
				}
			} catch (refreshError) {
				useAuthStore
					.getState()
					.clearState();
				return Promise.reject(
					refreshError
				);
			}
		}

		// Handle network errors
		if (!error.response) {
			const isConnectionRefused =
				error.code === 'ECONNREFUSED' ||
				error.message?.includes(
					'ERR_CONNECTION_REFUSED'
				) ||
				error.message?.includes(
					'Network Error'
				);

			const networkError: ApiError = {
				success: false,
				error: isConnectionRefused
					? 'Cannot connect to server. Please make sure the backend server is running.'
					: 'Network error. Please check your connection.',
			};
			return Promise.reject(
				networkError
			);
		}

		// Extract error message from response
		const errorMessage =
			error.response.data?.error ||
			error.response.data?.message ||
			error.message ||
			'An unexpected error occurred';

		const apiError: ApiError = {
			success: false,
			error: errorMessage,
			message:
				error.response.data?.message,
			details: error.response.data,
		};

		return Promise.reject(apiError);
	}
);

export default api;
