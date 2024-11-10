"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChat = exports.getUserChatsWithLastMessage = exports.findOrCreateChat = void 0;
const Chat_1 = require("../models/Chat");
const User_1 = __importDefault(require("../models/User"));
//find or create a new chat between two users
const findOrCreateChat = async (user1Id, user2Id) => {
    let chat = await Chat_1.Chat.findOne({
        participants: { $all: [user1Id, user2Id] },
    });
    if (!chat) {
        chat = new Chat_1.Chat({
            participants: [user1Id, user2Id],
            messages: [],
        });
        await chat.save();
        //update each user's chat list
        await User_1.default.findByIdAndUpdate(user1Id, { $push: { chats: chat._id } });
        await User_1.default.findByIdAndUpdate(user2Id, { $push: { chats: chat._id } });
        await chat.populate("participants", "username");
        await chat.populate("lastMessage", "content timestamp");
        await chat.populate("messages");
        return chat;
    }
};
exports.findOrCreateChat = findOrCreateChat;
//get all chats for a user with last message detail
const getUserChatsWithLastMessage = async (userId) => {
    const chats = await Chat_1.Chat.find({ participants: userId })
        .populate("participants", "username")
        .populate("lastMessage", "content timestamp")
        .populate("messages");
    return chats.map(item => item.toJSON());
};
exports.getUserChatsWithLastMessage = getUserChatsWithLastMessage;
//Delete a chat 
const deleteChat = async (chatId) => {
    await Chat_1.Chat.findByIdAndDelete(chatId);
};
exports.deleteChat = deleteChat;
