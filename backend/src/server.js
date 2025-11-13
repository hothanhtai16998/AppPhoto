import express from 'express';
import { env } from './libs/env.js';
import { CONNECT_DB } from './configs/db.js';
import path from 'path';
const app = express();

app.use(express.json());
const PORT = env.PORT || 5001;

const __dirname = path.resolve();
if(env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../fronted/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, '../fronted/dist/index.html'));
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