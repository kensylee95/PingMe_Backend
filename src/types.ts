import mongoose, { Document } from "mongoose";


export interface IUser extends Document{
    _id: mongoose.Types.ObjectId,
    username:string;
    password?: string;
    chats?:string[]
}

export interface JsonRequestError {
        message: Error["message"];
        name: Error["name"];
        stack?: Error["stack"];
}
export interface JsonRequestSuccess {
    message: string;
    response: any;
}
