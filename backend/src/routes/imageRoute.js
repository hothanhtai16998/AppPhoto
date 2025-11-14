import express from 'express';
import { getAllImages, uploadImage, getImagesByUserId } from '../controllers/imageController.js';
import { singleUpload } from '../middlewares/multerMiddleware.js';
// import { arcjetProtection } from '../middlewares/arcjetMiddleware.js';


const router = express.Router();

// router.use(arcjetProtection);

router.get('/', getAllImages);
router.post('/upload', singleUpload, uploadImage);

router.get('/user/:id', getImagesByUserId);

export default router;