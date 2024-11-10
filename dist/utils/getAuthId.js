"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const parseCookie_1 = __importDefault(require("./parseCookie"));
const getAuthId = (socket) => {
    // Secret key for JWT (replace with your own secret)
    const JWT_SECRET = process.env.JWT_SECRET || "";
    try {
        const cookieFromHeader = socket.request.headers.cookie;
        if (!cookieFromHeader) {
            throw new Error("No Cookie found");
        }
        const parsedCookies = (0, parseCookie_1.default)(cookieFromHeader);
        if (!parsedCookies) {
            throw new Error("Cookie not parsed");
        }
        const token = parsedCookies.authToken;
        if (!token) {
            throw new Error("Token not found");
        }
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const authUID = decoded.userId;
        return authUID;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
exports.getAuthId = getAuthId;
