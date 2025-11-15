import mongoose from 'mongoose';
import { VALIDATION } from '../utils/constants.js';

const imageSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: [true, "Public ID is required"],
            unique: true,
            index: true,
        },
        imageTitle: {
            type: String,
            required: [true, "Image title is required"],
            trim: true,
            maxlength: [VALIDATION.TITLE_MAX_LENGTH, `Title must be at most ${VALIDATION.TITLE_MAX_LENGTH} characters`],
        },
        imageUrl: {
            type: String,
            required: [true, "Image URL is required"],
        },
        imageCategory: {
            type: String,
            required: [true, "Image category is required"],
            trim: true,
            index: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Uploader is required"],
            index: true,
        },
        location: {
            type: String,
            trim: true,
            maxlength: [VALIDATION.LOCATION_MAX_LENGTH, `Location must be at most ${VALIDATION.LOCATION_MAX_LENGTH} characters`],
        },
        cameraModel: {
            type: String,
            trim: true,
            maxlength: [VALIDATION.CAMERA_MODEL_MAX_LENGTH, `Camera model must be at most ${VALIDATION.CAMERA_MODEL_MAX_LENGTH} characters`],
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes for better query performance
imageSchema.index({ uploadedBy: 1, createdAt: -1 });
imageSchema.index({ imageCategory: 1, createdAt: -1 });
imageSchema.index({ createdAt: -1 });
imageSchema.index({ publicId: 1 });

const Image = mongoose.model('Image', imageSchema);

export default Image;