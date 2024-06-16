import express from 'express';
import { getUserDetails, getUserId, loginUser, registerUser } from '../controllers/userController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/user/:userId',getUserId)
router.get('/me', authMiddleware, getUserDetails);


export default router;
