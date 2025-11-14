import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../libs/env.js';

export const protectedRoute = (req, res, next) => {
    try {
        //lấy token từ header
        const authHeader = req.headers['authorization'];

        //authorization trong Header có dạng "Bearer <token_string>" 
        // => khi chuyển qua array => ['Bearer', '<token_string>']
        // authHeader && authHeader.split(' ')[1];
        // authHear ở bên trái sẽ kiểm tra authHeader có null hay undefined không
        //nếu không thì authHeader.split(' ')[1] sẽ lấy ra <token_string>
        const token = authHeader && authHeader.split(' ')[1];
        //xác nhận token hợp lệ
        if (!token) {
            return res.status(401).json({ message: 'Access Token không tồn tại' });
        }
        //tìm user
        jwt.verify(token, env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {

            if (err) {
                return res.status(403).json({ message: 'Access Token hết hạn hoặc không đúng' });
            }
            //lấy ra user từ decodedUser
            const user = await User.findById(decodedUser.userId).select('-hashedPassword');

            //kiểm tra user có tồn tại hay không
            if (!user) {
                return res.status(403).json({ message: 'Người dùng không tồn tại' });
            }

            //nếu tồn tại user, thêm user vào req
            req.user = user;

            //xử lý request tiếp theo
            next();
        })

        //trả user về trong req
    } catch (error) {
        console.error('Lỗi khi xác minh JWT trong authMiddleware', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}