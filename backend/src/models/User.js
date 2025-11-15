import mongoose from "mongoose";
import { VALIDATION } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: [VALIDATION.USERNAME_MIN_LENGTH, `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`],
            maxlength: [VALIDATION.USERNAME_MAX_LENGTH, `Username must be at most ${VALIDATION.USERNAME_MAX_LENGTH} characters`],
            match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
        },
        hashedPassword: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: [VALIDATION.EMAIL_MAX_LENGTH, `Email must be at most ${VALIDATION.EMAIL_MAX_LENGTH} characters`],
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        displayName: {
            type: String,
            required: [true, "Display name is required"],
            trim: true,
            minlength: [VALIDATION.DISPLAY_NAME_MIN_LENGTH, `Display name must be at least ${VALIDATION.DISPLAY_NAME_MIN_LENGTH} characters`],
            maxlength: [VALIDATION.DISPLAY_NAME_MAX_LENGTH, `Display name must be at most ${VALIDATION.DISPLAY_NAME_MAX_LENGTH} characters`],
        },
        avatarUrl: {
            type: String,
        },
        avatarId: {
            type: String,
        },
        bio: {
            type: String,
            maxlength: [VALIDATION.BIO_MAX_LENGTH, `Bio must be at most ${VALIDATION.BIO_MAX_LENGTH} characters`],
            trim: true,
        },
        phone: {
            type: String,
            sparse: true,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.hashedPassword;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes for better query performance
// Note: username and email already have indexes from unique: true
userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);
export default User;
