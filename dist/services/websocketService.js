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
exports.initializeWebSocketServer = void 0;
const messageService = __importStar(require("@services/messageService"));
const socketMiddleware_1 = __importDefault(require("src/middlewares/socketMiddleware"));
//events
const senderTyping = "typing";
const receiverTyping = "userTyping";
const joinChat = "joinChat";
const sendMessage = "sendMessage";
const RecieveMessage = "receiveMessage";
const userOnline = "online";
//-------------------------------------------------
const onlineStatus = {};
const initializeWebSocketServer = (io) => {
    io.on("connection", (socket) => {
        if (!(0, socketMiddleware_1.default)(socket))
            return;
        const authId = socket;
        console.log(authId);
        socket.on("userOnline", async (userId) => {
            onlineStatus[userId] = socket.id;
            //const chats = await getUserChatsWithLastMessage(userId)
        });
        //console.log("[Socket]: connected")
        //join a secific chat room for a one-to-one chat
        socket.on(joinChat, (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.id} joined chat ${chatId}`);
        });
        //Listen for sending a message
        socket.on(sendMessage, async (messageData) => {
            const { chatId, senderId, content } = messageData;
            console.log(`${senderId} sent this ${content}`);
            //Create the message in the database
            const message = await messageService.sendMessage(chatId, senderId, content);
            //Emit the message to all users in the chat room
            io.to(chatId).emit(RecieveMessage, { chatId, message });
        });
        //Handle typing indicator
        socket.on(senderTyping, (data) => {
            console.log("user typing", data.userId);
            socket.to(data.chatId).emit(receiverTyping, data);
        });
        //handle disconnect
        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
        });
    });
};
exports.initializeWebSocketServer = initializeWebSocketServer;
