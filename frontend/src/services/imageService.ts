import api from '@/lib/axios';
import type { UploadImageData } from '@/types/store';

export const imageService = {
	uploadImage: async (
		data: UploadImageData
	) => {
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

		const res = await api.post(
			'/images/upload',
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

	fetchImages: async () => {
		const res = await api.get(
			'/images',
			{ withCredentials: true }
		);
		return res.data.images;
	},
};
