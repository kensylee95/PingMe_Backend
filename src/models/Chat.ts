
import {Document, model, Schema, Types } from "mongoose";

export interface ChatType extends Document{
    participants: Types.ObjectId[];
    messages: Types.ObjectId[];
    lastMessage?:string;
}
const ChatSchema = new Schema<ChatType>({
    participants:[{type: Schema.Types.ObjectId, ref: 'User', required:true}],
    messages:[{type:Schema.Types.ObjectId, ref:'Message'}],
    lastMessage:{type:Schema.Types.ObjectId, ref:'Message'},
});
ChatSchema.index( {participant:1}),{unique:true}
export const  Chat = model<ChatType>('Chat', ChatSchema);