import mongoose from "mongoose";
import env from "./env.js"
import logger from "../utils/logger.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri)
    const { host, port, name } = mongoose.connection;
    logger.info("MongoDB connected successfully");
    logger.info(
      `MongoDB connected | Database: ${name} | Host: ${host} | Port: ${port}`
    );
  } catch (error) {
    logger.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
    
  } catch (error) {
    logger.error("MongoDB disconnection failed:", error.message);
  }
};

export {connectDatabase,disconnectDatabase};
