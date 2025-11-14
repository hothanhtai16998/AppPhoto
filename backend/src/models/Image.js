import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
        unique: true,
    },
    imageTitle: {
        type: String,
        required: true,
    },
    imageCategory: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    cameraModel: {
        type: String,
    },
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

export default Image;