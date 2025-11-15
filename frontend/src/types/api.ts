/**
 * Standard API Response Types
 */
export interface ApiResponse<
	T = unknown
> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	count?: number;
}

export interface ApiError {
	success: false;
	error: string;
	message?: string;
	details?: unknown;
}

export interface PaginatedResponse<T>
	extends ApiResponse<T[]> {
	count: number;
	page?: number;
	totalPages?: number;
}
