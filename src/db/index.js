import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // Ensure .js is included

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\nMongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.error("MONGODB connection error: " + err.message);
    process.exit(1);
  }
};

export default connectDB;
