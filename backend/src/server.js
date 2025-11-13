import express from 'express';
import { env } from './libs/env.js';
import { CONNECT_DB } from './configs/db.js';

const app = express();

const PORT = env.PORT || 5001;
app.use(express.json());


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