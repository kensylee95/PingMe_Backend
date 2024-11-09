"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("cookie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socketMiddleware = (socket) => {
    // Secret key for JWT (replace with your own secret)
    const JWT_SECRET = process.env.JWT_SECRET || "";
    const cookieFromHeader = socket.request.headers.cookie;
    if (!cookieFromHeader) {
        console.log("no cookies found");
        return false;
    }
    const parsedCookies = cookie_1.default.parse(cookieFromHeader);
    if (!parsedCookies) {
        console.log(parsedCookies);
        console.log('No cookie found');
        return false;
    }
    const token = parsedCookies.authToken;
    if (!token) {
        console.log("Token not found");
        return false;
    }
    // Verify JWT token
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    // Attach user data to the socket
    socket.user.id = decoded; // We assume the JWT contains a `User` object
    console.log(decoded);
    return true;
};
exports.default = socketMiddleware;
