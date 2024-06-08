import User from "../models/user.model.js"
import bycryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res , next ) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success:false,
            message:"Fill all the details"
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
        res.status(201).json("User created Sucessfully ")
    } catch (error) {
        // res.status(500).json(error.message);
        next(error)
        // next(errorHandler(550 , 'error from the function'))
    }

    // console.log(req.body)
}

export const signin = async(req,res,next) => {
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Fill all the details"
        })
    }

    try {
        const validUser = await User.findOne({email});
        // if(!validUser){
        //     return res.status(500).json({
        //         success:false,
        //         message:"User Not found,"
        //     })  
        // }

        //new way 
        if(!validUser) return next(errorHandler(404, 'User not Found'));
        const validPassword = bycryptjs.compareSync(password , validUser.password);
        if(!validPassword) return next(errorHandler(401,'Wrong Credentials!...'));
        const token = jwt.sign({id:validUser._id} , process.env.JWT_SECRET)
        validUser.password= undefined
        res.cookie('access_token',token ,{
            httpOnly:true,
        })
        .status(200)
        .json(validUser);

    } catch (error) {
        next(error)
    }
}