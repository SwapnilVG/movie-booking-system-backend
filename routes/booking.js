import express from 'express';
import { createBooking, createRazorpayOrder, getBookings, verifyRazorpayPayment, getBookedSeats, lockSeat, cancelBooking } from '../controllers/bookingController.js';
import { admin, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createBooking);
// router.get('/', authMiddleware, getBookings);
router.delete('/:id',authMiddleware,admin,cancelBooking)
router.get('/',authMiddleware,admin,getBookings)
router.post('/create-order', authMiddleware, createRazorpayOrder);
router.post('/verify-payment', authMiddleware, verifyRazorpayPayment);
router.get('/seats', authMiddleware, getBookedSeats);
router.post('/lock-seat', lockSeat);

export default router;
