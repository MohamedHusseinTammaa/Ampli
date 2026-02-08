import User from "../Models/User.js";
const signup = async (user)=>{
    await user.save();
    const newuser = await User.find({ _id: user.id }, { password: 0, __v: 0 });
    return newuser;
}
const login = async (email)=>{
    const user = await User.findOne({ email });
    return user;
}
const getAllUsers = async (limit,skip)=>{
    const projection = {password:0, __v:0,deleted:0}
    const users = await User.find({deleted:false},projection).limit(limit).skip(skip).lean();
    return users;
}
export{
    signup,
    login,
    getAllUsers
}