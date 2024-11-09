import { Chat } from "@models/Chat";
import { Message } from "@models/Message"

//send a new message in a chat
export const sendMessage:(chatId:string, senderId: string, content:string)=>Promise<Message> = async (chatId, senderId, content) => {
    const newMessage:Message = new Message({
        sender: senderId,
        chat: chatId,
        content,
        timestamp: new Date(),
        status:"sent",
    });
    const message = await newMessage.save();

    //update the chat with new message
    await Chat.findByIdAndUpdate(chatId, {
        $push: {messages: newMessage._id},
        lastMessage: newMessage._id,
    });
    return message;
}

//get all messages in chat
export const getMessagesInChat:(chatId:string)=>Promise<Message[]> = async(chatId)=>{
    const message:Message[] = await Message.find({chat:chatId}).sort({timeStamp: 1});
    return message;
};

//update message status
export const updateMessagesStatus:(messagesId:string, status:"sent"|"delivered"|"read")=>Promise<Message|null> = async(messagesId, status)=>{
    const message:Message|null = await Message.findByIdAndUpdate(messagesId, {status});
    return message;
}
//delete a message
export const deleteMessage:(messageId:string, chatId:string)=>void = async(messageId, chatId)=>{
    await Message.findByIdAndDelete(messageId);
    await Chat.findByIdAndUpdate(chatId, {$pull:{messages:messageId}});
}