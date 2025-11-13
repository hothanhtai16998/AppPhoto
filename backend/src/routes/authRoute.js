import express from 'express';
import {signUp} from '../controllers/authController.js';

const router = express.Router();

router.get('/test', (req, res) => {
    res.send({ message: 'Hello, Express!' });
})


router.post('/signup', signUp)
router.post('/signup', signUp)

export default router;