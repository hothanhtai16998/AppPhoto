import cloudinary from '../libs/cloudinary.js';
import Image from '../models/Image.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../utils/errors.js';
import { FILE_UPLOAD } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

export const getAllImages = asyncHandler(async (req, res) => {
    const images = await Image.find()
        .populate('uploadedBy', 'username displayName avatarUrl')
        .select('-__v')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: images.length,
        images,
    });
});

export const uploadImage = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { imageTitle, imageCategory, location, cameraModel } = req.body;

    if (!req.file) {
        throw new AppError('Image file is required', 400);
    }

    // Validate file type
    if (!FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
        throw new AppError(
            `Invalid file type. Allowed types: ${FILE_UPLOAD.ALLOWED_MIME_TYPES.join(', ')}`,
            400
        );
    }

    // Validate file size
    if (req.file.size > FILE_UPLOAD.MAX_SIZE) {
        throw new AppError(
            `File size exceeds maximum allowed size of ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`,
            400
        );
    }

    let uploadResponse;
    try {
        // Convert buffer from multer to a Data URI for Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'photo-app-images',
            resource_type: 'image',
        });

        // Create image record in database
        const newImage = await Image.create({
            imageUrl: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            imageTitle: imageTitle.trim(),
            imageCategory: imageCategory.trim(),
            uploadedBy: userId,
            location: location?.trim(),
            cameraModel: cameraModel?.trim(),
        });

        // Populate uploadedBy field
        await newImage.populate('uploadedBy', 'username displayName avatarUrl');

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newImage,
        });
    } catch (error) {
        // Rollback Cloudinary upload if DB save failed
        if (uploadResponse && uploadResponse.public_id) {
            try {
                await cloudinary.uploader.destroy(uploadResponse.public_id);
            } catch (rollbackError) {
                logger.error('Failed to rollback Cloudinary upload:', rollbackError);
            }
        }
        throw error;
    }
});

export const getImagesByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const images = await Image.find({ uploadedBy: userId })
        .populate('uploadedBy', 'username displayName avatarUrl')
        .select('-__v')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: images.length,
        images,
    });
});

