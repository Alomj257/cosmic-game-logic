import mongoose from "mongoose";
import { config } from "./envConfig.js";
import logger from "./winstonLoggerConfig.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.DB_CONNECTION_STRING);

        mongoose.connection.on('connected', () => {
            logger.info('Connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            logger.error(`Mongoose connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Mongoose connection is disconnected');
        });

    } catch (err) {
        logger.error(`Failed to connect to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
