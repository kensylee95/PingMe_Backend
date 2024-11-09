import CustomErrorClass from "@utils/HttpError";
import Cookies from "cookies";
import { NextFunction,Request,Response} from "express";
import jwt from "jsonwebtoken"
import { JsonRequestError } from "src/types";

const authenticateJWT:(request:Request, response:Response, next:NextFunction)=>any = (req, res, next)=>{
   try{ const cookies = new Cookies(req, res)
    console.log(req.userId)
    const token = cookies.get("authToken");
    if(!token){
        const error = new CustomErrorClass("Authorization token required", 401);
        throw error;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    req.userId= decoded.userId;
    next();
}
catch(error){
    if(error instanceof CustomErrorClass){
        const response:JsonRequestError = error
        return res.status(error.statusCode).json({message:response.message, name:response.name, stack:response.stack})
    }
    if(error instanceof jwt.TokenExpiredError){
        const response:JsonRequestError = error
       return res.status(401).json({message:"Token Expired, Please Log in", name:response.name, stack:response.stack})
    }
    if(error instanceof jwt.JsonWebTokenError){
        const response:JsonRequestError = error
       return res.status(403).json({message:"Invalid token", name:response.name, stack:response.stack})
    }
    else if(error instanceof Error){
        const response:JsonRequestError = error
        return res.status(500).json({message:response.message, name:response.name, stack:response.stack})
    }
   
    else {
        return res.status(500).json({message:"An error occured"})
    }       
}}
export default authenticateJWT