import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { generateToken } from "@utils/jwt";
import CustomErrorClass from "@utils/HttpError";
import { JsonRequestError } from "src/types";
import User, { UserModelType } from "@models/User";
import { FlattenMaps } from "mongoose";


interface ResponseType {
    message: string, response: { user: FlattenMaps<UserModelType>}
  }
   const registerUser:(req:Request, res:Response)=>Promise<any> = async (req, res)=>{

    const {username, password}:{username:string, password:string} = req.body;
    console.log(username)
    
    try{
        const existingUser = await User.findOne({username:username.toLowerCase()})
        if(existingUser){
           const error = new CustomErrorClass("Username already taken!", 400);
           throw error;
        }

        const hashedPassword = await bcrypt.hash(password!, 10)
        const insertedUserDocument:UserModelType = await User.create({username:username.toLowerCase(), password: hashedPassword});
        const insertedUserStripped:UserModelType = await User.findById(insertedUserDocument._id).select("-password");
        const stripeUserJson = insertedUserStripped.toJSON();
        const token = generateToken(stripeUserJson._id)
        //const cookies = new Cookies(req, res, {keys:[process.env.JWT_SECRET ||""]});
        res.cookie('authToken', token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: "lax"
        })
        const response:ResponseType = {message:"Registration Completed", response:{user:stripeUserJson}}
        console.log(response)
        res.status(201).json({...response})
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
export default registerUser