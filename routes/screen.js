import express from 'express';
import { getScreens, postScreens, updateScreens, deleteScreens, getBookings, deleteBookings } from '../controllers/ScreenController.js';
import { admin, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/screens', authMiddleware, admin, getScreens);
router.post('/screens', authMiddleware, admin, postScreens);
router.put('/screens/:id', authMiddleware, admin, updateScreens);
router.delete('/screens/:id', authMiddleware, admin, deleteScreens);
router.get('/bookings', authMiddleware, admin, getBookings);
router.delete('/bookings/:id', authMiddleware, admin, deleteBookings);

export default router;
