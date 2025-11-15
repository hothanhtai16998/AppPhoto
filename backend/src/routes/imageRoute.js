import express from 'express';
import { getAllImages, uploadImage, getImagesByUserId } from '../controllers/imageController.js';
import { singleUpload } from '../middlewares/multerMiddleware.js';
import { validateImageUpload } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', getAllImages);
router.post('/upload', singleUpload, validateImageUpload, uploadImage);
router.get('/user/:userId', getImagesByUserId);

export default router;