import { validationResult } from 'express-validator';
import ErrorAsyncWrapper from '../Utils/Errors/ErrorAsyncWrapper.js';
import ErrorHandler from '../Utils/Errors/Error.js';
import User from '../Models/User.js';
import * as Services from '../Services/User.Services.js'
import bcrypt from 'bcrypt';
import blackListedTokenModel from '../Models/BlockedList.js';
import "dotenv/config"
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { httpStatus } from '../Utils/HTTP/http.state.js';
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
    try {
    const { user, verificationToken } = await Services.signup(newUser);
    await Services.sendVerificationEmail(user.email, verificationToken);
    res.status(201).json({
      success: true,
      message: "User created. Please verify your email.",
      user,
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
    if (!isPasswordCorrect) {
      return next(new ErrorHandler("Invalid email or password", 400, "Invalid email or password"));
    }
    if (!user.emailVerified) {
      return next(new ErrorHandler("Please verify your email before signing in", 403, "Email not verified"));
    }
    const token = jwt.sign({ email: user.email, _id: user._id, jti: uuidv4() }, process.env.JWT_SECRET,{ expiresIn: "12m" });
    res.status(200).json({
        success: true,
        message: "logged in successfully",
        token
    });
});
const getAllUsers = ErrorAsyncWrapper(async (req, res,next) => {
    const limit = req.query.limit ||10;
    const page = req.query.page ||1;
    const skip = (page-1)*limit;
    const users = await Services.getAllUsers(limit,skip);
    res.status(200).json({
        success:true,
        data: users,
        pagination :{
            limit :limit,
            page : page
        }
    })
});
const confirmEmail = ErrorAsyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorHandler("Validation errors", 400, errors.array()));
  }
  const { email, token } = req.query;
  const result = await Services.confirmEmail(email, token);
  if (result.alreadyVerified) {
    return res.status(200).json({ success: true, message: "Email is already verified." });
  }
  if (!result.success) {
    const message = result.reason === "expired" ? "Verification link has expired." : "Invalid or expired verification link.";
    return next(new ErrorHandler(message, 400, result.reason));
  }
  res.status(200).json({ success: true, message: "Email verified successfully." });
});

const resendVerificationEmail = ErrorAsyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorHandler("Validation errors", 400, errors.array()));
  }
  const { email } = req.query;
  const result = await Services.resendVerificationEmail(email);
  if (result.notFound) {
    return res.status(200).json({ success: true, message: "If an account exists, a new verification email was sent." });
  }
  if (result.alreadyVerified) {
    return next(new ErrorHandler("Email is already verified.", 400, "already_verified"));
  }
  if (!result.sent) {
    return res.status(429).json({
      success: false,
      message: `Too many requests. Try again in ${result.retryAfterSeconds} seconds.`,
      retryAfterSeconds: result.retryAfterSeconds,
    });
  }
  res.status(200).json({ success: true, message: "Verification email sent." });
});

const logout = ErrorAsyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array())
        );
    }
    const token = req.currentUser
    console.log({ tokenJTI: token.jti });

    const data = await blackListedTokenModel.create({
        tokenId: req.currentUser.jti,
        expiresAt: new Date(Date.now())
    });

    res.status(200).json({
        status: httpStatus.OK,
        message: "logged out successfully"
    });
});
export {
  signup,
  login,
  getAllUsers,
  logout,
  confirmEmail,
  resendVerificationEmail,
}