// controllers/ScreenController.js
import Booking from "../models/Booking.js";
import Screen from "../models/Screen.js";

const getScreens = async (req, res) => {
  try {
    const screens = await Screen.find();
    res.json(screens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postScreens = async (req, res) => {
  try {
    const screen = new Screen(req.body);
    await screen.save();
    res.json(screen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateScreens = async (req, res) => {
  try {
    const screen = await Screen.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(screen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteScreens = async (req, res) => {
  try {
    await Screen.findByIdAndDelete(req.params.id);
    res.json({ message: 'Screen deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBookings = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getScreens, postScreens, updateScreens, deleteScreens, getBookings, deleteBookings };
