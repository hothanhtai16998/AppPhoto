import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";
import { ConflictError, AuthenticationError, AppError } from "../utils/errors.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { TOKEN_CONFIG, PASSWORD_CONFIG } from "../utils/constants.js";
import { env } from "../libs/env.js";

export const signUp = asyncHandler(async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        if (existingUser.username === username) {
            throw new ConflictError("Username already exists");
        }
        throw new ConflictError("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, PASSWORD_CONFIG.SALT_ROUNDS);

    // Create new user
    await User.create({
        username: username.toLowerCase(),
        hashedPassword,
        email: email.toLowerCase(),
        displayName: `${firstName} ${lastName}`,
    });

    res.status(204).send();
});

export const signIn = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        throw new AuthenticationError("Username and password are required");
    }

    // Find user by username (case-insensitive) and include hashedPassword
    const user = await User.findOne({ username: username.toLowerCase() })
        .select('+hashedPassword');

    if (!user) {
        throw new AuthenticationError("Invalid username or password");
    }

    // Verify password
    if (!user.hashedPassword) {
        throw new AuthenticationError("Invalid user data");
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
        throw new AuthenticationError("Invalid username or password");
    }

    // Generate access token
    const accessToken = jwt.sign(
        { userId: user._id },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_TTL }
    );

    // Generate refresh token
    const refreshToken = crypto.randomBytes(TOKEN_CONFIG.REFRESH_TOKEN_LENGTH).toString("hex");

    // Create session to store refresh token
    await Session.create({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + TOKEN_CONFIG.REFRESH_TOKEN_TTL),
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: TOKEN_CONFIG.REFRESH_TOKEN_TTL,
    });

    res.status(200).json({
        message: `User ${user.displayName} logged in successfully`,
        accessToken,
    });
});

export const signOut = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (token) {
        // Delete refresh token from session
        await Session.deleteOne({ refreshToken: token });

        // Clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
    }

    res.status(204).send();
});

export const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        throw new AuthenticationError("Refresh token not found");
    }

    // Find session by refresh token
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
        throw new AuthenticationError("Invalid or expired refresh token");
    }

    // Check if token has expired
    if (session.expiresAt < new Date()) {
        await Session.deleteOne({ refreshToken: token });
        throw new AuthenticationError("Refresh token has expired");
    }

    // Generate new access token
    const accessToken = jwt.sign(
        { userId: session.userId },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_TTL }
    );

    res.status(200).json({ accessToken });
});
