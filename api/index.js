import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"
import authRouter from './routes/auth.route.js'

dotenv.config();
const PORT =  process.env.PORT || 6000

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('Connected to Mongoose')
}).catch((err)=>{
    console.log(err)
})


const app = express();

app.use(express.json());

app.listen(PORT , () =>{
    console.log(`Server is running at Port ${PORT}`);
})

app.use("/api/user" , userRouter)
app.use("/api/auth",authRouter);


//middleware for the errors if status code is not there in the error 
app.use((err,req,res , next) => {
    const statusCode = err.statusCode || 500; //internal server error 
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
});