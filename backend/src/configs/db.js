import mongoose from'mongoose';
import {env} from '../libs/env.js';
export const CONNECT_DB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('MongoDB connected...');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}