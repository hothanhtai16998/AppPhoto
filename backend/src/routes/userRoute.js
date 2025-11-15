import express from 'express';
import { authMe } from '../controllers/userController.js';

const router = express.Router();

// protectedRoute middleware is already applied at route level in server.js
router.get('/me', authMe);

export default router;