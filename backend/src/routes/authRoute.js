import express from 'express';
import {signUp, signIn} from '../controllers/authController.js';

const router = express.Router();

router.get('/test', (req, res) => {
    res.send({ message: 'Hello, Express!' });
})


router.post('/signup', signUp)
router.post('/signin', signIn)

export default router;