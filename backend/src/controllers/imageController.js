import Image from '../models/Image.js';
import cloudinary from '../libs/cloudinary.js';

export const getAllImages = async (req, res) => { }


export const uploadImage = async (req, res) => {
    let uploadResponse; // Define it here to access in the catch block
    try {
        const userId = req.user._id;
        // Destructure all expected fields from the JSON body
        const { imageData, imageTitle, imageCategory, location, cameraModel } = req.body;

        // --- Validation ---
        if (!imageData) {
            return res.status(400).json({ message: 'Image data is required.' });
        }
        if (!imageTitle) {
            return res.status(400).json({ message: 'Image title is required.' });
        }
        if (!imageCategory) {
            return res.status(400).json({ message: 'Image category is required.' });
        }
        // The 'location' field is required in your Image model
        if (!location) {
            return res.status(400).json({ message: 'Location is required.' });
        }

        // --- Upload to Cloudinary ---
        // The uploader expects a Base64 Data URI string: "data:image/jpeg;base64,..."
        uploadResponse = await cloudinary.uploader.upload(imageData, {
            folder: 'photo-app-images', // Optional: organize uploads into a specific folder
        });

        // --- Create new image document in MongoDB ---
        const newImage = await Image.create({
            imageUrl: uploadResponse.secure_url, // URL from Cloudinary
            publicId: uploadResponse.public_id, // Store public_id to allow deletion later
            imageTitle,
            imageCategory,
            uploadedBy: userId,
            location,
            cameraModel, // This is optional and can be null
        });

        res.status(201).json({
            message: 'Image uploaded successfully!',
            image: newImage,
        });
    } catch (error) {
        console.error('Error during image upload:', error);

        // --- Suggested Addition: Rollback Logic ---
        // If image was uploaded to Cloudinary but DB save failed, delete it
        if (uploadResponse && uploadResponse.public_id) {
            await cloudinary.uploader.destroy(uploadResponse.public_id);
        }
        // --- End of Addition ---

        res.status(500).json({ message: 'Server error while uploading image.' });
    }
}

export const getImagesByUserId = async (req, res) => {
    const userId = req.user._id;

    try {
        const images = await Image.find({ uploadedBy: userId });
        res.status(200).json({ images });
    } catch (error) {
        console.error('Error while retrieving images by user:', error);
        res.status(500).json({ message: 'Server error while retrieving images.' });
    }
}