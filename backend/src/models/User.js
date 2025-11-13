import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    displayName: { type: String, trim:true , required: true},
    //role: { type: String, enum: ['admin', 'user'], default: 'user' },
    avatarUrl: { type: String, default: 'https://i.stack.imgur.com/l60Hf.png' },
    avatarId: { type: String },
    phone: { type: String, sparse: true},
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;