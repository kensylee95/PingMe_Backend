"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("@models/User"));
const HttpError_1 = __importDefault(require("@utils/HttpError"));
;
const jwt_1 = require("@utils/jwt");
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const usernameU = username.toLowerCase();
        const user = await User_1.default.findOne({ username: usernameU });
        if (!user) {
            const error = new HttpError_1.default("Invalid username or password", 400);
            throw error;
        }
        const isMatch = await bcrypt_1.default.compare(password?.trim() || "", user.password?.trim());
        if (!isMatch) {
            console.log("compare failed");
            const error = new HttpError_1.default("Invalid username or password/n", 400);
            throw error;
        }
        //get user without password field
        const insertedUserStripped = await User_1.default.findById(user._id).select("-password");
        const stripeUserJson = insertedUserStripped.toJSON();
        //get token
        const token = (0, jwt_1.generateToken)(stripeUserJson._id);
        //set cookies
        // const cookies = new Cookies(req, res, {keys:[process.env.JWT_SECRET ||""]});
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax"
        });
        //response
        const response = { message: "Registration Completed", response: { username, _id: user._id } };
        //return response
        return res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof HttpError_1.default) {
            return res.status(error.statusCode).json({ message: error.message, name: error.name, stack: error.stack });
        }
        else if (error instanceof Error) {
            return res.status(500).json({ message: error.message, stack: error.stack });
        }
        else {
            return res.status(500).json({ message: "An error occured" });
        }
    }
};
exports.default = loginUser;
