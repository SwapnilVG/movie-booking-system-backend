import Booking from '../models/Booking.js';
import LockedSeat from '../models/LockedSeat.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import  sendMail  from '../utils/mailer.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

const createBooking = async (req, res) => {
  const { movie, showtime, seats, totalPrice } = req.body;
  try {
    const booking = new Booking({ user: req.user._id, movie, showtime, seats, totalPrice });
    await booking.save();

    const recipientEmail = req.user.email;
    if (!recipientEmail) {
      throw new Error('No email address found for the user');
    }

    // Send booking confirmation email
    sendMail(
      recipientEmail,
      'Booking Confirmation',
      `Your booking for ${movie} on ${showtime} has been confirmed. Seats: ${seats.join(', ')}`
    );

    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user screen', 'name email');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(400).json({ message: error.message });
  }
};

const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user, movie, showtime, seats, totalPrice } = req.body;
  console.log("User data:",user);
  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');
    if (generated_signature === razorpay_signature) {
      const existingBookings = await Booking.find({ showtime, seats: { $in: seats }, status: 'confirmed' });
      if (existingBookings.length > 0) {
        // Send seat availability alert email
        sendMail(
          user.email,
          'Seat Availability Alert',
          `The following seats are no longer available: ${seats.filter(seat => existingBookings.some(booking => booking.seats.includes(seat))).join(', ')}`
        );

        return res.status(400).json({ message: 'Some of the selected seats are already booked' });
      }
      const booking = new Booking({ user, movie, showtime, seats, totalPrice, status: 'confirmed' });
      await booking.save();

      // Send booking confirmation email
      // sendMail(
      //   user.email,
      //   'Booking Confirmation',
      //   `Your booking for ${movie} on ${showtime} has been confirmed. Seats: ${seats.join(', ')}`
      // );

      res.status(201).json({ message: 'Payment verified and booking created successfully' });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getBookedSeats = async (req, res) => {
  const { showtime } = req.query;
  try {
    const lockedSeats = await LockedSeat.find({ showtime }).select('seat -_id');
    const bookedSeats = await Booking.find({ showtime }).select('seats -_id');
    const allLockedSeats = lockedSeats.map(ls => ls.seat);
    const allBookedSeats = bookedSeats.flatMap(bs => bs.seats);

    res.status(200).json({ lockedSeats: allLockedSeats, bookedSeats: allBookedSeats });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ message: error.message });
  }
};

const lockSeat = async (req, res) => {
  const { seats, showtime } = req.body;

  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: 'Seats must be a non-empty array' });
  }
  if (!showtime) {
    return res.status(400).json({ message: 'Showtime is required' });
  }

  try {
    const existingLockedSeats = await LockedSeat.find({ seat: { $in: seats }, showtime });
    const existingBookedSeats = await Booking.find({ seats: { $in: seats }, showtime });
    if (existingLockedSeats.length > 0 || existingBookedSeats.length > 0) {
      return res.status(409).json({ message: 'Some seats are already locked or booked' });
    }

    const lockedSeats = seats.map(seat => ({ seat, showtime }));
    await LockedSeat.insertMany(lockedSeats);
    res.status(200).json({ message: 'Seats locked successfully' });
  } catch (error) {
    console.error('Error locking seats:', error);
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).send({ error: 'Booking not found.' });
    }

    res.send(booking);
  } catch (error) {
    res.status(500).send({ error: 'Failed to cancel booking.' });
  }
};

export { createBooking, getBookings, createRazorpayOrder, verifyRazorpayPayment, getBookedSeats, lockSeat, cancelBooking };
