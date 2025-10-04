import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/dataBase.js';
import authRouter from './route/auth.route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(express.json());


app.use('/api/auth', authRouter);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});