import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import 'dotenv/config';
import bodyParser from 'body-parser';

const app = express();
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["POST","GET","PUT","DELETE"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(bodyParser.json());
// Routes
import userRoutes  from './routes/user.js';
import bookingRoutes from './routes/booking.js';
import screenRoutes from './routes/screen.js'

app.get("/",(req,res)=>{
    res.json("Hello")
})
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/screens', screenRoutes);

export default app;