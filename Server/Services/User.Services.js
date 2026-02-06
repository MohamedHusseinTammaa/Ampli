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
export{
    signup,
    login
}