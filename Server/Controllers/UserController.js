import { validationResult } from 'express-validator';
import ErrorAsyncWrapper from '../Utils/Errors/ErrorAsyncWrapper.js';
import ErrorHandler from '../Utils/Errors/Error.js';
import User from '../Models/User.js';
import * as Services from '../Services/User.Services.js'
import bcrypt from 'bcrypt';
import "dotenv/config"
import jwt from 'jsonwebtoken';
const signup = ErrorAsyncWrapper(async (req, res,next) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
     return next(new ErrorHandler("validation Errors",400,errors));
   }
   let { name: { first, last }, dateOfBirth, gender, phoneNumber, email, password } = req.body;
   if (dateOfBirth){
    const [day, month, year] = dateOfBirth.split("-");
    dateOfBirth = new Date(year, month - 1, day);
   }
   const hashedPassword = await bcrypt.hash(password, 10);
   const newUser = new User({
    name: { first, last },
    dateOfBirth,
    gender,
    phoneNumber,
    email,
    password: hashedPassword,
    });
    try{
    const user = await Services.signup(newUser);
    res.status(201).json({
        success: true,
        message: "User created successfully",
        user
    });
    } catch (error) {
        if(error.code === 11000){
            return next(new ErrorHandler("User already exists",400,"Email or phone number already exists"));
        }
        return next(new ErrorHandler("Error creating user",500,error.message));
    }
});
const login = ErrorAsyncWrapper(async (req, res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return next(new ErrorHandler("validation Errors",400,errors));
    }
    const { email, password } = req.body;
    const user = await Services.login(email, password);
    if(!user){
        return next(new ErrorHandler("Invalid email or password",400,"Invalid email or password"));
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return next(new ErrorHandler("Invalid email or password",400,"Invalid email or password"));
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET,{ expiresIn: "12m" });
    res.status(200).json({
        success: true,
        message: "logged in successfully",
        token
    });
});
export{
    signup,
    login
}