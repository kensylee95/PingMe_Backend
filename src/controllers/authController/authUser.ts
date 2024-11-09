import { UserModelType } from "@models/User"
import { getUserById } from "@services/userService"
import { Request, Response } from "express"

export const authUser : (req:Request, res:Response) => Promise<void> = async(req, res)=>{
 if(req.userId){
     const authenticatedUser :UserModelType|null = await getUserById(req.userId);
  authenticatedUser &&  res.json({authUser:authenticatedUser.toJSON()});
}
}