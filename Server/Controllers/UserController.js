import { validationResult } from 'express-validator';
import ErrorAsyncWrapper from '../Utils/Errors/ErrorAsyncWrapper.js';
import ErrorHandler from '../Utils/Errors/Error.js';
import User from '../Models/User.js';
import * as Services from '../Services/User.Services.js'
const signup = ErrorAsyncWrapper(async (req, res,next) => {
   const errors = validationResult(req);
   if(errors){
    next(new ErrorHandler("validation Errors",400,errors));
   }
   let { name: { first, last }, dateOfBirth, gender, phoneNumber, email, password } = req.body;
   if (dateOfBirth){
    const [day, month, year] = dateOfBirth.split("-");
    dateOfBirth = new Date(year, month - 1, day);
   }
   const hashedPassword = await bcrypt.hash(password, 10);
   const newUser = new User({
    name: { first, last },
    userName,
    dateOfBirth,
    gender,
    phoneNumber,
    email,
    password: hashedPassword,
    role,
    avatar : req.file?.filename
    });
    const user = await Services.signup(newUser);
});