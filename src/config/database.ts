import mongoose from "mongoose";
import { config } from "./config";

export const connect_database = async () => {
    try {
        await mongoose.connect(config.mongodb_uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

