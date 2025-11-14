import express from 'express';
import { env } from './libs/env.js';
import { CONNECT_DB } from './configs/db.js';
import path from 'path';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js';
import { protectedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
const PORT = env.PORT || 5001;

const __dirname = path.resolve();


// API Routes
app.use('/api/auth', authRoute);
app.use('/api/users', protectedRoute, userRoute);


if (env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    });
}




//start server and connect to database
const START_DB = async () => {
    try {
        await CONNECT_DB()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

START_DB();
