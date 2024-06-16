import mongoose from "mongoose";

const lockedSeatSchema = new mongoose.Schema({
    seat: { type: String, required: true },
    showtime: { type: Date, required: true },
    lockedAt: { type: Date, default: Date.now, expires: 300 } // Automatically delete after 5 minutes
  });

  const lockedSeat = mongoose.model('LockedSeat', lockedSeatSchema);
  export default lockedSeat;  