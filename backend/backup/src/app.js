import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/database.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import appRoutes from "./routes/app.routes.js";
import auth from './middlewares/auth.js';
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Set Content Security Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src *;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});

connectDB(); // Database connection

// Routes here
app.use(auth);
app.use(appRoutes);

app.use(globalErrorHandler); // Middleware error handler

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
});

export default app;
