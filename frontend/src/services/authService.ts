import api from '@/lib/axios';
import { API_CONFIG } from '@/constants/api';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

interface SignUpData {
	username: string;
	password: string;
	email: string;
	firstName: string;
	lastName: string;
}

interface SignInData {
	username: string;
	password: string;
}

interface SignInResponse {
	accessToken: string;
	message?: string;
}

export const authService = {
	signUp: async (
		data: SignUpData
	): Promise<void> => {
		await api.post<ApiResponse>(
			API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
			data,
			{
				withCredentials: true,
			}
		);
	},

	signIn: async (
		data: SignInData
	): Promise<SignInResponse> => {
		const res =
			await api.post<SignInResponse>(
				API_CONFIG.ENDPOINTS.AUTH
					.SIGNIN,
				data,
				{ withCredentials: true }
			);
		return res.data;
	},

	signOut: async (): Promise<void> => {
		await api.post(
			API_CONFIG.ENDPOINTS.AUTH.SIGNOUT,
			{}, // Send empty object instead of null
			{
				withCredentials: true,
			}
		);
	},

	fetchMe: async (): Promise<User> => {
		// Backend returns { success: true, user: User }
		const res = await api.get<{
			success: boolean;
			user: User;
		}>(API_CONFIG.ENDPOINTS.USERS.ME, {
			withCredentials: true,
		});
		return res.data.user;
	},

	refresh:
		async (): Promise<string> => {
			const res = await api.post<{
				accessToken: string;
			}>(
				API_CONFIG.ENDPOINTS.AUTH
					.REFRESH,
				{}, // Send empty object instead of null
				{ withCredentials: true }
			);
			return res.data.accessToken;
		},
};
