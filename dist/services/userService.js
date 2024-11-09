"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersByUsername = exports.getUserFriends = exports.addUserChat = exports.getUserByUsername = exports.getUserById = void 0;
const User_1 = __importDefault(require("@models/User"));
//fetch user by id
const getUserById = async (userId) => {
    const user = await User_1.default.findById(userId).select("-password");
    return user;
};
exports.getUserById = getUserById;
//fetch user by username
const getUserByUsername = async (username) => {
    return await User_1.default.findOne({ username }).select("-password -chats");
};
exports.getUserByUsername = getUserByUsername;
//add a chat ID to a user's chat list
const addUserChat = async (userId, chatId) => {
    return await User_1.default.findByIdAndUpdate(userId, { $push: { chats: chatId } });
};
exports.addUserChat = addUserChat;
//list all friends for a user
const getUserFriends = async (userId) => {
    return await User_1.default.findById(userId).populate("friends", "username");
};
exports.getUserFriends = getUserFriends;
//search users by username
const searchUsersByUsername = async (searchTerm) => {
    return await User_1.default.find({
        username: { $regex: searchTerm, $options: "i" }
    });
};
exports.searchUsersByUsername = searchUsersByUsername;
