// models/Screen.js
import mongoose from 'mongoose';

const ScreenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  seatLimit: {
    type: Number,
    required: true
  }
});

const Screen = mongoose.model('Screen', ScreenSchema);

export default Screen;
