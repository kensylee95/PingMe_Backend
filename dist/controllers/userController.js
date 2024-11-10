"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.getUserByUsername = exports.getUser = void 0;
const userService = __importStar(require("../services/userService"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const getUser = async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if (!user)
        return res.status(404).json({ message: "user not found" });
    res.json(user);
};
exports.getUser = getUser;
const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const existingUser = await userService.getUserByUsername(username.toLowerCase());
        if (!existingUser) {
            const error = new HttpError_1.default("User not found", 404);
            throw error;
        }
        const response = { message: "Found User", response: { user: existingUser.toJSON() } };
        console.log(response);
        res.status(200).json(response);
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
exports.getUserByUsername = getUserByUsername;
const searchUsers = async (req, res) => {
    const users = await userService.searchUsersByUsername(req.query.username);
    res.json(users);
};
exports.searchUsers = searchUsers;
