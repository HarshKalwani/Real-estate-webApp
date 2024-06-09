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

export const google = async(req,res,next) =>{
    try {
        const user = await User.findOne({email : req.body.email})
        if(user){
            const token = jwt.sign({id:user._id} ,process.env.JWT_SECRET);
            // user.password = undefined;  
            // one more way is here 
            const {password:pass,...rest}=user._doc;
            res.cookie('access_token' , token , {httpOnly:true}).status(200).json(rest)
        }else{
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); //this will generate a strong password
            // first 8 digit password out of 26 alphabets and 0-9 numbers and then another as same config with diff num then adding both string
            const hashedPassword = await bycryptjs.hashSync(generatePassword,10);
            const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) ,email:req.body.email , password:hashedPassword , avatar:req.body.photo})
            await newUser.save();
            const token = jwt.sign({id: newUser._id} ,process.env.JWT_SECRET);
            const {password:pass,...rest}=newUser._doc;
            res.cookie('access_token' , token , {httpOnly:true}).status(200).json(rest)
        }
    } catch (error) {
        next(error)
    }
}