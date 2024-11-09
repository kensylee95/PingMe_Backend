import { Chat, ChatType } from "@models/Chat"
import User from "@models/User";
import { FlattenMaps } from "mongoose";

//find or create a new chat between two users
export const findOrCreateChat = async (user1Id: string, user2Id:string)=>{
    let chat = await Chat.findOne({
        participants:{$all:[user1Id, user2Id]},
    });
    if(!chat){
        chat = new Chat({
            participants:[user1Id, user2Id],
            messages:[],
        });
        await chat.save();
        //update each user's chat list
        await User.findByIdAndUpdate(user1Id,{$push:{chats:chat._id}})
        await User.findByIdAndUpdate(user2Id, {$push:{chats:chat._id}})
       await chat.populate("participants", "username")
        await chat.populate("lastMessage","content timestamp")
        await chat.populate("messages")
        return chat;
    }
};

//get all chats for a user with last message detail
export const getUserChatsWithLastMessage:(userId:string)=>Promise<FlattenMaps<ChatType[]>> =async(userId)=>{
    const chats:ChatType[] = await Chat.find({participants:userId})
    .populate("participants", "username",)
    .populate("lastMessage","content timestamp")
    .populate("messages")
    return chats.map(item=>item.toJSON());
};

//Delete a chat 
export const deleteChat= async(chatId:string)=>{
    await Chat.findByIdAndDelete(chatId);
}