import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: Boolean // false = male, true = female
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate : [validator.isMobilePhone,"feild must be a valid phone number"],
        match : [/^[0-9]+$/,"feild must be a valid phone number"],
        minlength: 10,
        maxlength: 15,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate : [validator.isEmail,"feild must be a valid email"]
    },
    password: {
        type: String,
        required : true,
        minlength: 8,
        trim: true,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt:{
        type:Date
    },
    restoreUntil:{
        type:Date
    },
    deleted:{
        type :Boolean,
        default:false
    }

});

const User= mongoose.model('users',userSchema);
export default User;