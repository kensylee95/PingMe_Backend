import * as chatService from "@services/chatService";
import { Request, Response } from "express";

export const getUserChats:(req:Request, res:Response) => Promise<void> = async (req, res)=>{
   if(req.userId){
    const chats = await chatService.getUserChatsWithLastMessage(req.userId);
    res.json(chats)

   }

}

export const createChat = async(req:Request, res:Response)=>{
    const user1id:string|undefined = req.userId;
    const{user2Id} = req.body;
    const chat = await chatService.findOrCreateChat(user1id!, user2Id);
    console.log(chat?.toJSON())
    res.json(chat?.toJSON());
}

