
import cloudinary from '../libs/cloudinary.js';
import Image from '../models/Image.js';

// Helper function to convert buffer to data URI
const bufferToDataURI = (buffer, mimeType) => {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
};

export const getAllImages = async (req, res) => {
    try {
        const images = await Image.find()
            .populate('uploadedBy', 'username')
            .sort({ createdAt: -1 });
        res.status(200).json({ images });
    } catch (error) {
        res.status(500).json({
            message: 'Server error while fetching images.',
        });
    }
};

export const uploadImage = async (req, res) => {
    let uploadResponse;
    try {
        const userId = req.user._id;
        const { imageTitle, imageCategory, location, cameraModel } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required.' });
        }
        if (!imageTitle || !imageCategory || !location) {
            return res
                .status(400)
                .json({ message: 'Title, category, and location are required.' });
        }

        // Convert buffer from multer to a Data URI for Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

        // Upload to Cloudinary
        uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'photo-app-images',
        });

        const newImage = await Image.create({
            imageUrl: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            imageTitle,
            imageCategory,
            uploadedBy: userId,
            location,
            cameraModel,
        });

        res.status(201).json({
            message: 'Image uploaded successfully!',
            image: newImage,
        });
    } catch (error) {
        console.error('Error during image upload:', error);

        // If Cloudinary upload succeeded but DB save failed, roll back the upload.
        if (uploadResponse && uploadResponse.public_id) {
            try {
                await cloudinary.uploader.destroy(uploadResponse.public_id);
            } catch (e) {
                console.error('Failed to rollback Cloudinary upload:', e);
            }
        }

        res.status(500).json({ message: 'Server error while uploading image.' });
    }
};

export const getImagesByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const images = await Image.find({ uploadedBy: userId }).sort({
            createdAt: -1,
        });
        res.status(200).json({ images });
    } catch (error) {
        res.status(500).json({
            message: 'Server error while fetching user images.',
        });
    }
};
