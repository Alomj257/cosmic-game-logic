import createHttpError from "http-errors";
import logger from "../config/winstonLoggerConfig.js";
import { jwtServices } from "../services/jwt.services.js";
import { config } from "../config/envConfig.js";
import { publicRoutes } from "../constant.js";

const auth = (req, res, next) => {

    // Check if the current path matches any of the public routes
    const isPublicRoute = publicRoutes.some(route => {
        if (typeof route === 'string') {
            return route === req.path;
        }
        if (route instanceof RegExp) {
            return route.test(req.path); // Test for regex patterns
        }
        return false;
    });

    if (isPublicRoute) {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        logger.warn(`{Api:${req.url}, Message:"Authorization header missing"}`);
        return next(createHttpError(401, "unauthorized"));
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        logger.warn(`{Api:${req.url}, Message:"Invalid Authorization header format"}`);
        return next(createHttpError(401, "unauthorized"));
    }

    const token = parts[1];

    try {
        const { userId, email, userType: role } = jwtServices.verify(token, config.JWT_SECRET);
        req.user = { userId, email, role };
        next();
    } catch (error) {
        logger.error(`{Api:${req.url}, Error:${error.message}, Stack:${error.stack} }`);
        return next(createHttpError(401, "unauthorized"));
    }
};

export default auth;