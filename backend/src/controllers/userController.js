import { asyncHandler } from '../middlewares/errorHandler.js';

export const authMe = asyncHandler(async (req, res) => {
    // User is already attached to req by protectedRoute middleware
    const user = req.user;

    res.status(200).json({
        success: true,
        user,
    });
});
