"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const cookies_1 = __importDefault(require("cookies"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    try {
        const cookies = new cookies_1.default(req, res);
        console.log(req.userId);
        const token = cookies.get("authToken");
        if (!token) {
            const error = new HttpError_1.default("Authorization token required", 401);
            throw error;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        if (error instanceof HttpError_1.default) {
            const response = error;
            return res.status(error.statusCode).json({ message: response.message, name: response.name, stack: response.stack });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            const response = error;
            return res.status(401).json({ message: "Token Expired, Please Log in", name: response.name, stack: response.stack });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            const response = error;
            return res.status(403).json({ message: "Invalid token", name: response.name, stack: response.stack });
        }
        else if (error instanceof Error) {
            const response = error;
            return res.status(500).json({ message: response.message, name: response.name, stack: response.stack });
        }
        else {
            return res.status(500).json({ message: "An error occured" });
        }
    }
};
exports.default = authenticateJWT;
