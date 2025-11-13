import bcrypt from 'bcrypt';
import User from '../models/User.js';
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
        console.error('Lỗi khi gọi signup',error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}