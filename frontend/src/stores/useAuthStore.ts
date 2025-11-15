import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore =
	create<AuthState>((set, get) => ({
		accessToken: null,
		user: null,
		loading: false,
		isInitializing: true,

		setAccessToken: (accessToken) => {
			set({ accessToken });
		},
		clearState: () => {
			set({
				accessToken: null,
				user: null,
				loading: false,
			});
		},

		signUp: async (
			username,
			password,
			email,
			firstName,
			lastName
		) => {
			try {
				set({ loading: true });

				//  gọi api
				await authService.signUp({
					username,
					password,
					email,
					firstName,
					lastName,
				});

				toast.success(
					'Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.'
				);
			} catch (error: unknown) {
				const errorMessage =
					error &&
					typeof error === 'object' &&
					'error' in error
						? String(error.error)
						: 'Đăng ký không thành công';
				console.error(
					'Sign up error:',
					error
				);
				toast.error(errorMessage);
				throw error;
			} finally {
				set({ loading: false });
			}
		},

		signIn: async (
			username,
			password
		) => {
			try {
				set({ loading: true });

				const { accessToken } =
					await authService.signIn({
						username,
						password,
					});
				get().setAccessToken(
					accessToken
				);

				await get().fetchMe();

				toast.success(
					'Chào mừng bạn quay lại với Moji 🎉'
				);
			} catch (error: unknown) {
				const errorMessage =
					error &&
					typeof error === 'object' &&
					'error' in error
						? String(error.error)
						: 'Đăng nhập không thành công!';
				console.error(
					'Sign in error:',
					error
				);
				toast.error(errorMessage);
				throw error;
			} finally {
				set({ loading: false });
			}
		},

		signOut: async () => {
			try {
				get().clearState();
				await authService.signOut();
				toast.success(
					'Logout thành công!'
				);
			} catch (error: unknown) {
				const errorMessage =
					error &&
					typeof error === 'object' &&
					'error' in error
						? String(error.error)
						: 'Lỗi xảy ra khi logout. Hãy thử lại!';
				console.error(
					'Sign out error:',
					error
				);
				toast.error(errorMessage);
			}
		},

		fetchMe: async () => {
			try {
				set({ loading: true });
				const user =
					await authService.fetchMe();

				set({ user });
			} catch (error: unknown) {
				const errorMessage =
					error &&
					typeof error === 'object' &&
					'error' in error
						? String(error.error)
						: 'Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!';
				console.error(
					'Fetch me error:',
					error
				);
				set({
					user: null,
					accessToken: null,
				});
				toast.error(errorMessage);
			} finally {
				set({ loading: false });
			}
		},

		refresh: async () => {
			try {
				const {
					user,
					fetchMe,
					setAccessToken,
				} = get();
				const accessToken =
					await authService.refresh();

				setAccessToken(accessToken);

				if (!user) {
					await fetchMe();
				}
			} catch (error: unknown) {
				console.error(
					'Refresh token error:',
					error
				);

				// Check if it's a network error vs authentication error
				// The error might be an ApiError (from axios interceptor) or AxiosError
				const errorObj =
					error &&
					typeof error === 'object'
						? error
						: {};

				// Check for ApiError structure: { success: false, error: "message" }
				const errorMessage =
					'error' in errorObj
						? String(errorObj.error)
						: '';

				// Check for AxiosError code (before interceptor transforms it)
				const errorCode =
					'code' in errorObj
						? String(errorObj.code)
						: '';

				// Network errors have specific messages or codes
				// Check for exact messages from axios interceptor or common network error indicators
				const lowerErrorMessage =
					errorMessage.toLowerCase();
				const isNetworkError =
					errorCode === 'ERR_NETWORK' ||
					errorCode ===
						'ECONNREFUSED' ||
					lowerErrorMessage.includes(
						'network error'
					) ||
					lowerErrorMessage.includes(
						'network'
					) ||
					lowerErrorMessage.includes(
						'connect'
					) ||
					lowerErrorMessage.includes(
						'cannot connect'
					) ||
					lowerErrorMessage.includes(
						'connection refused'
					) ||
					lowerErrorMessage.includes(
						'backend server is running'
					) ||
					lowerErrorMessage.includes(
						'check your connection'
					);

				if (isNetworkError) {
					// Don't show toast or clear state for network errors during initialization
					// Network errors are expected if backend is not running
					// The user will see appropriate error messages when making actual API calls
					console.debug(
						'Network error during token refresh - backend may not be running'
					);
					return;
				}

				// Only show session expired message for actual auth errors
				toast.error(
					'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!'
				);
				get().clearState();
			}
		},

		initializeApp: async () => {
			try {
				await get().refresh();
			} catch (e) {
				// Silently handle initialization errors
				// Network errors during initialization are expected if backend is down
				// Auth errors will be handled by the refresh method
				console.debug(
					'App initialization error:',
					e
				);
			} finally {
				set({ isInitializing: false });
			}
		},
	}));
