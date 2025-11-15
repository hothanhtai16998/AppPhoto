import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AuthenticationError, NotFoundError } from "../utils/errors.js";
import { asyncHandler } from "./errorHandler.js";
import { env } from "../libs/env.js";

/**
 * Middleware to protect routes requiring authentication
 */
export const protectedRoute = asyncHandler(async (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        throw new AuthenticationError("Access token not found");
    }

    try {
        // Verify and decode token
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

        // Find user
        const user = await User.findById(decoded.userId).select("-hashedPassword");

        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new AuthenticationError("Invalid or expired access token");
    }
});
