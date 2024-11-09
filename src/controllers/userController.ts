import { UserModelType } from "@models/User";
import * as userService from "@services/userService"
import CustomErrorClass from "@utils/HttpError";
import { Request, Response } from "express"
import { JsonRequestSuccess, JsonRequestError } from "src/types";

export const getUser:(req:Request, res:Response)=>void = async(req, res)=>{
    const user = await userService.getUserById(req.params.id)
    if(!user)return res.status(404).json({message:"user not found"});
    res.json(user)
}

export const getUserByUsername:(req:Request, res:Response)=>Promise<any> = async(req, res)=>{
    try{    
    const{ username}=req.params;
        const existingUser:UserModelType = await userService.getUserByUsername(username.toLowerCase())
    if(!existingUser){
        const error = new CustomErrorClass("User not found",404)
           throw error;
    }
    const response:JsonRequestSuccess = {message:"Found User", response:{user:existingUser.toJSON()}}
    console.log(response)
    res.status(200).json(response) 
    }
    catch(error){
        if(error instanceof CustomErrorClass){
            const response:JsonRequestError = error
            res.status(error.statusCode).json({message:response.message, name:response.name, stack:response.stack})
        }
        else if(error instanceof Error){
            const response:JsonRequestError = error
            res.status(500).json({message:response.message, name:response.name, stack:response.stack})
        }
       
        else {
            return res.status(500).json({message:"An error occured"})
        }  
    }
}

export const searchUsers:(req:Request, res:Response)=>void = async (req, res)=>{
    const users = await userService.searchUsersByUsername(req.query.username as string);
    res.json(users);
}