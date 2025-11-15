import api from '@/lib/axios';
import { API_CONFIG } from '@/constants/api';
import type { UploadImageData } from '@/types/store';
import type { Image } from '@/types/image';

interface ImageResponse {
	success: boolean;
	image?: Image;
	images?: Image[];
	count?: number;
	message?: string;
}

export const imageService = {
	uploadImage: async (
		data: UploadImageData
	): Promise<ImageResponse> => {
		const formData = new FormData();
		formData.append(
			'image',
			data.image
		);
		formData.append(
			'imageTitle',
			data.imageTitle
		);
		formData.append(
			'imageCategory',
			data.imageCategory
		);

		if (data.location) {
			formData.append(
				'location',
				data.location
			);
		}
		if (data.cameraModel) {
			formData.append(
				'cameraModel',
				data.cameraModel
			);
		}

		const res =
			await api.post<ImageResponse>(
				API_CONFIG.ENDPOINTS.IMAGES
					.UPLOAD,
				formData,
				{
					headers: {
						'Content-Type':
							'multipart/form-data',
					},
					withCredentials: true,
				}
			);

		return res.data;
	},

	fetchImages: async (): Promise<
		Image[]
	> => {
		const res = await api.get<{
			success: boolean;
			count: number;
			images: Image[];
		}>(
			API_CONFIG.ENDPOINTS.IMAGES.BASE,
			{ withCredentials: true }
		);
		return res.data.images || [];
	},

	fetchImagesByUserId: async (
		userId: string
	): Promise<Image[]> => {
		const res = await api.get<{
			success: boolean;
			count: number;
			images: Image[];
		}>(
			API_CONFIG.ENDPOINTS.IMAGES.BY_USER(
				userId
			),
			{ withCredentials: true }
		);
		return res.data.images || [];
	},
};
