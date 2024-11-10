"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.updateMessagesStatus = exports.getMessagesInChat = exports.sendMessage = void 0;
const Chat_1 = require("../models/Chat");
const Message_1 = require("../models/Message");
//send a new message in a chat
const sendMessage = async (chatId, senderId, content) => {
    const newMessage = new Message_1.Message({
        sender: senderId,
        chat: chatId,
        content,
        timestamp: new Date(),
        status: "sent",
    });
    const message = await newMessage.save();
    //update the chat with new message
    await Chat_1.Chat.findByIdAndUpdate(chatId, {
        $push: { messages: newMessage._id },
        lastMessage: newMessage._id,
    });
    return message;
};
exports.sendMessage = sendMessage;
//get all messages in chat
const getMessagesInChat = async (chatId) => {
    const message = await Message_1.Message.find({ chat: chatId }).sort({ timeStamp: 1 });
    return message;
};
exports.getMessagesInChat = getMessagesInChat;
//update message status
const updateMessagesStatus = async (messagesId, status) => {
    const message = await Message_1.Message.findByIdAndUpdate(messagesId, { status });
    return message;
};
exports.updateMessagesStatus = updateMessagesStatus;
//delete a message
const deleteMessage = async (messageId, chatId) => {
    await Message_1.Message.findByIdAndDelete(messageId);
    await Chat_1.Chat.findByIdAndUpdate(chatId, { $pull: { messages: messageId } });
};
exports.deleteMessage = deleteMessage;
