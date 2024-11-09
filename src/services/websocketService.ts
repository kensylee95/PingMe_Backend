//import { IncomingMessage, Server, ServerResponse } from "http";
//import { broadcastUserStatus, handlePrivateMessage, handleStatusUpdate, handleTypingEvent } from "@controllers/websocketController";
//import jwt from "jsonwebtoken"
import { Server } from "socket.io"
import * as messageService from "@services/messageService"
import { getUserChatsWithLastMessage } from "./chatService";
import { getAuthId } from "@utils/getAuthId";

//events
const senderTyping = "typing";
const receiverTyping = "userTyping";
const joinChat = "joinChat";
const sendMessage = "sendMessage"
const RecieveMessage = "receiveMessage";
//-------------------------------------------------
// In-memory storage for users' socket connections
const onlineUsers: { [userId: string]: string } = {}

export const initializeWebSocketServer: (io: Server) => void = (io) => {
    io.on("connection", (socket) => {
        console.log(`[Socket]: connected with id: ${socket.id}`)
        const authId = getAuthId(socket);
        //if not authenticated return
        if (!authId) return;
        //add user to online

        //join a secific chat room for a one-to-one chat
        socket.on(joinChat, async (chatId) => {
            // Save the user's socketId to the onlineUsers list
            onlineUsers[authId] = socket.id;
            // Fetch the list of chats this user is part of
            const chats = await getUserChatsWithLastMessage(authId);
            //for eac user that is a 
            chats.forEach((chat) => {
                chat.participants.forEach((participant) => {
                    const participantId = participant._id.toString();
                    if (participantId !== authId && onlineUsers[participantId]) {
                        console.log(`telling ${participantId} that ${authId} is online`)
                        io.to(onlineUsers[participantId]).emit('userOnline', authId);
                    }
                })
            })
            //get his friends that are online that are online
            // Create a Set to store unique online friends' IDs
            let onlineFriendsIds: Set<string> = new Set();

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
            console.log(`User ${socket.id} joined chat ${chatId}`)
        });

        //Listen for sending a message
        socket.on(sendMessage, async (messageData: { chatId: string, senderId: string, content: string }) => {
            const { chatId, senderId, content } = messageData;
            console.log(`${senderId} sent this ${content}`)
            //Create the message in the database
            const message = await messageService.sendMessage(chatId, senderId, content)
            //Emit the message to all users in the chat room
            io.to(chatId).emit(RecieveMessage, { chatId, message });
        });

        //Handle typing indicator
        socket.on(senderTyping, (data: { chatId: string, userId: string }) => {
            console.log("user typing", data.userId)
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
                    delete onlineUsers[userId];  // Remove from online users list
                    break;
                }
            }

            if (disconnectedUserId) {
                // Notify other participants in the chats the user was part of
                const chats = await getUserChatsWithLastMessage(authId)
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



    })
};
