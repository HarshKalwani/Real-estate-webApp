import User from "../models/user.model.js"
import bycryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Fill all the details"
        })
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) {
        return res.status(400).json({
            success:false,
            message:"User Already Exist",
        })
    }

    const hashedPassword = bycryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json({
            success:true,
            message:"User created Sucessfully ",
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }

    console.log(req.body)
}