import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: {
    id: Number,
    title: String,
    overview: String,
    release_date: String,
    vote_average: Number,
    poster_path: String
  },
  showtime: { type: Date, required: true },
  seats: [{ type: String, required: true }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'reserved' } // 'reserved' or 'confirmed'
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
