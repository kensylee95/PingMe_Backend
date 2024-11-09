import * as messageService from "@services/messageService";
import { Request, Response } from "express";

export const sendMessage:(req:Request, res:Response) => Promise<void> = async (req, res)=>{
       const {chatId, senderId, content}= req.body;
       const message = await messageService.sendMessage(chatId, senderId, content)
       res.json(message)
}
export const getMessages:(req:Request, res:Response) => Promise<void> = async(req, res)=>{
    const messages = await messageService.getMessagesInChat(req.params.chatId);
    res.json(messages);
}