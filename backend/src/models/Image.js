import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: true,
            unique: true
        },
        imageTitle: {
            type: String,
            required: true,
            trim: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        imageCategory: {
            type: String,
            required: true,
            trim: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        location: {
            type: String,
            trim: true
        },
        cameraModel: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true // This automatically adds createdAt and updatedAt fields
    }
);

const Image = mongoose.model('Image', imageSchema);

export default Image;