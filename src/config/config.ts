import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    mongodb_uri:
        process.env.MONGODB_URI || "",
    node_env: process.env.NODE_ENV || "development",
    exam_duration_minutes: Number(process.env.EXAM_DURATION_MINUTES ?? 7),
};
