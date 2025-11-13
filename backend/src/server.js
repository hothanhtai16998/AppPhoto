import express from 'express';
import { env } from './libs/env.js';
import { CONNECT_DB } from './configs/db.js';
import path from 'path';
import authRoute from './routes/authRoute.js';

const app = express();

app.use(express.json());
const PORT = env.PORT || 5001;

const __dirname = path.resolve();

app.use('/api/auth', authRoute)

if (env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    });
}



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