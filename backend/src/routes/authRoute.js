import express from 'express';
import { signUp, signIn, signOut, refreshToken } from '../controllers/authController.js';
import { validateSignUp, validateSignIn } from '../middlewares/validation.js';

const router = express.Router();

router.post('/signup', validateSignUp, signUp);
router.post('/signin', validateSignIn, signIn);
router.post('/signout', signOut);
router.post('/refresh', refreshToken);

export default router;