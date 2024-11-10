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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocketServer = void 0;
const messageService = __importStar(require("./messageService"));
const chatService_1 = require("./chatService");
const getAuthId_1 = require("../utils/getAuthId");
//events
const senderTyping = "typing";
const receiverTyping = "userTyping";
const joinChat = "joinChat";
const sendMessage = "sendMessage";
const RecieveMessage = "receiveMessage";
//-------------------------------------------------
// In-memory storage for users' socket connections
const onlineUsers = {};
const initializeWebSocketServer = (io) => {
    io.on("connection", (socket) => {
        console.log(`[Socket]: connected with id: ${socket.id}`);
        const authId = (0, getAuthId_1.getAuthId)(socket);
        //if not authenticated return
        if (!authId)
            return;
        //add user to online
        //join a secific chat room for a one-to-one chat
        socket.on(joinChat, async (chatId) => {
            // Save the user's socketId to the onlineUsers list
            onlineUsers[authId] = socket.id;
            // Fetch the list of chats this user is part of
            const chats = await (0, chatService_1.getUserChatsWithLastMessage)(authId);
            //for each user that is a 
            chats.forEach((chat) => {
                chat.participants.forEach((participant) => {
                    const participantId = participant._id.toString();
                    if (participantId !== authId && onlineUsers[participantId]) {
                        console.log(`telling ${participantId} that ${authId} is online`);
                        io.to(onlineUsers[participantId]).emit('userOnline', authId);
                    }
                });
            });
            //get his friends that are online that are online
            // Create a Set to store unique online friends' IDs
            let onlineFriendsIds = new Set();
            // Loop over the chats and participants to check if they are online
            chats.forEach((chat) => {
                chat.participants.forEach((participant) => {
                    const participantId = participant._id.toString();
                    // Check if the participant is online and not the current user
                    if (participantId !== authId && onlineUsers[participantId]) {
                        onlineFriendsIds.add(participantId); // Add to the set of online friends
                    }
                });
            });
            // Convert Set to Array and send it to the user
            socket.emit("onlineFriends", Array.from(onlineFriendsIds));
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
        // Handle disconnection
        socket.on('disconnect', async () => {
            // Find the user that disconnected based on socket id
            let disconnectedUserId = null;
            for (const userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    disconnectedUserId = userId;
                    delete onlineUsers[userId]; // Remove from online users list
                    break;
                }
            }
            if (disconnectedUserId) {
                // Notify other participants in the chats the user was part of
                const chats = await (0, chatService_1.getUserChatsWithLastMessage)(authId);
                chats.forEach(chat => {
                    chat.participants.forEach(participant => {
                        const participantId = participant._id.toString();
                        // Don't notify the user themselves, just the others
                        if (participantId !== disconnectedUserId && onlineUsers[participantId]) {
                            io.to(onlineUsers[participantId]).emit('userOffline', disconnectedUserId);
                        }
                    });
                });
                console.log(`${disconnectedUserId} disconnected`);
            }
        });
    });
};
exports.initializeWebSocketServer = initializeWebSocketServer;
