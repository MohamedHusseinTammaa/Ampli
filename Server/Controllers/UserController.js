import { validationResult } from 'express-validator';
import ErrorAsyncWrapper from '../Utils/Errors/ErrorAsyncWrapper.js';
import ErrorHandler from '../Utils/Errors/Error.js';
import User from '../Models/User.js';
import * as Services from '../Services/User.Services.js'
import bcrypt from 'bcrypt';
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

export{
    signup
}