import mongoose from 'mongoose';
import "dotenv/config"
const url = process.env.DB_URL;

const connectDB = async () => {
    if (!url) {
        throw new Error("MONGODB URL is not defined in .env");
    }
    try {
        await mongoose.connect(url);
        console.log("MongoDB is connected");
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
export default connectDB;