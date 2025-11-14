import express from 'express';
import { authMe } from '../controllers/userController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/me', protectedRoute, authMe)

router.get('/test', (req, res) => {
    res.send({ message: 'Hello, Express!' });
})

export default router;