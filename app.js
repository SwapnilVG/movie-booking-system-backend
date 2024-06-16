import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import 'dotenv/config';
import bodyParser from 'body-parser';

const app = express();
app.use(cors({
    origin:[process.env.FRONTEND_URL],  
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
// Routes
import userRoutes  from './routes/user.js';
import bookingRoutes from './routes/booking.js';
import screenRoutes from './routes/screen.js'

app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/screens', screenRoutes);

export default app;