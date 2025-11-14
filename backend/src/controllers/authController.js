import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { env } from '../libs/env.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m'
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

//đã xong
export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'Xin vui lòng điền đầy đủ thông tin' });
        }

        // Check if username is already taken
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
        }

        // Check if email is already taken
        const userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName}  ${lastName}`,
        })

        return res.sendStatus(204)
        // Send email verification link
        // sendEmailVerificationLink(newUser);
        // Send a success message to the user
        // res.json({ message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.' });
        // Log the user in automatically
        // req.login(newUser, { session: false }, (err) => {
        //     if(err) {
        //         return res.status(500).json({ message: 'Internal Server Error' });
        //     }
        //     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        //     res.json({ token });
        // });



    } catch (error) {
        console.error('Lỗi khi gọi signup', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}

//đã xong
export const signIn = async (req, res) => {
    try {
        //lấy username và password từ request body mà người dùng nhập vào
        const { username, password } = req.body;

        //kiểm tra tên tài khoản và mật khẩu có rỗng hay không
        if (!username || !password) {
            return res.status(400).json({ message: 'Thiếu tên tài khoản hoặc mật khẩu' });
        }

        //Kiểm tra tài khoản có tồn tại hay không
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
        }

        //kiểm tra mật khẩu có khớp với mật khẩu đã được mã hoá trong db không
        const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
        }

        // Tạo access token để xác thực user
        const accessToken = jwt.sign({ userId: user._id }, env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // Tạo refreshToken dùng để tạo access token mới
        // refreshToken cỏ thể lưu thông tin đăng nhập của user
        // mà không cần user phải đăng nhập lại sau khi refresh hoặc mở lại trang web
        const refreshToken = crypto.randomBytes(32).toString('hex');

        //tạo session mới để lưu refreshToken
        await Session.create({
            userId: user._id,
            refreshToken, expiresAt: new Date(Date.now()) + REFRESH_TOKEN_TTL
        });

        //trả refreshToken về client thông qua cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL
        });

        return res.status(200).json({ message: `User ${user.displayName} đã đăng nhập`, accessToken });

    } catch (error) {
        console.error('Lỗi khi gọi signIn', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}

export const signOut = async (req, res) => {
    try {
        //lấy refreshToken từ cookie
        const token = req.cookies?.refreshToken;
        if (token) {
            //xoá refreshToken từ session hiện tại
            await Session.deleteOne({ refreshToken: token });
        }
        //xoá cookie
        res.clearCookie('refreshToken');

        return res.sendStatus(204);

    } catch (error) {
        console.error('Lỗi khi gọi signOut', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}