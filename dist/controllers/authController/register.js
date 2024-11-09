"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("@utils/jwt");
const HttpError_1 = __importDefault(require("@utils/HttpError"));
const User_1 = __importDefault(require("@models/User"));
const registerUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    try {
        const existingUser = await User_1.default.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            const error = new HttpError_1.default("Username already taken!", 400);
            throw error;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const insertedUserDocument = await User_1.default.create({ username: username.toLowerCase(), password: hashedPassword });
        const insertedUserStripped = await User_1.default.findById(insertedUserDocument._id).select("-password");
        const stripeUserJson = insertedUserStripped.toJSON();
        const token = (0, jwt_1.generateToken)(stripeUserJson._id);
        //const cookies = new Cookies(req, res, {keys:[process.env.JWT_SECRET ||""]});
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax"
        });
        const response = { message: "Registration Completed", response: { user: stripeUserJson } };
        console.log(response);
        res.status(201).json({ ...response });
    }
    catch (error) {
        if (error instanceof HttpError_1.default) {
            const response = error;
            res.status(error.statusCode).json({ message: response.message, name: response.name, stack: response.stack });
        }
        else if (error instanceof Error) {
            const response = error;
            res.status(500).json({ message: response.message, name: response.name, stack: response.stack });
        }
        else {
            return res.status(500).json({ message: "An error occured" });
        }
    }
};
exports.default = registerUser;
