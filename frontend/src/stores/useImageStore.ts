import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { imageService } from '@/services/imageService';
import type {
	ImageState,
	UploadImageData,
} from '@/types/store';

export const useImageStore = create(
	immer<ImageState>((set) => ({
		images: [],
		loading: false,
		error: null,
		uploadImage: async (
			data: UploadImageData
		) => {
			set((state) => {
				state.loading = true;
				state.error = null;
			});
			try {
				const newImage =
					await imageService.uploadImage(
						data
					);
				set((state) => {
					state.images.unshift(
						newImage.image
					);
					state.loading = false;
				});
			} catch (error) {
				console.error(
					'Failed to upload image:',
					error
				);
				set((state) => {
					state.loading = false;
					state.error =
						'Failed to upload image.';
				});
			}
		},
		fetchImages: async () => {
			set((state) => {
				state.loading = true;
				state.error = null;
			});
			try {
				const images =
					await imageService.fetchImages();
				set((state) => {
					state.images = images;
					state.loading = false;
				});
			} catch (error) {
				console.error(
					'Failed to fetch images:',
					error
				);
				set((state) => {
					state.loading = false;
					state.error =
						'Failed to fetch images.';
				});
			}
		},
	}))
);
