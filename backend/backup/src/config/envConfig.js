import { config as conf } from 'dotenv';
conf();

const _config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key',
    JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '1d',
    SENDER_EMAIL: process.env.SENDER_EMAIL,
    SENDER_EMAIL_PASSWORD: process.env.SENDER_EMAIL_PASSWORD
};

export const config = Object.freeze(_config);