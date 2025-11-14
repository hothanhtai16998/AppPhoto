import express from 'express';
import { getAllImages, uploadImage, getImagesByUserId } from '../controllers/imageController.js';

// import { arcjetProtection } from '../middlewares/arcjetMiddleware.js';

const router = express.Router();

// router.use(arcjetProtection);

router.get('/', getAllImages);
router.post('/upload', uploadImage)

router.get('/:id', getImagesByUserId)

export default router;