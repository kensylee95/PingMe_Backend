import mongoose, { Document, Schema, Types,} from "mongoose";

export interface Message extends Document{
    sender:Types.ObjectId;
    chat:Types.ObjectId;
    content: string;
    timestamp:Date;
    status: "sent"|"delivered"|"read"
}
const MessageSchema = new Schema<Message>({
    sender:{type: Schema.Types.ObjectId, ref:'User', required:true},
    chat:{type:Schema.Types.ObjectId, ref:'Chat', required:true},
    content:{type:String, required:true},
    timestamp:{type:Date, default:Date.now},
    status:{type:String, enum:["sent", 'delivered', "read"], default:"sent"},
});
export const Message = mongoose.model<Message>("Message", MessageSchema);