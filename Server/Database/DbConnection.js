import mongoose from 'mongoose';
import "dotenv/config"
const url = process.env.DB_URL;
if (!url) {
    throw new Error("MONGODB URL is not defined in .env");
}
const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
export default connectDB;