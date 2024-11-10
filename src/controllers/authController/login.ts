import { Request, Response } from "express";
import bcrypt from "bcrypt"
import User, { UserModelType } from "@models/User";
import CustomErrorClass from "@utils/HttpError";;
import { generateToken } from "@utils/jwt";
import { cookieOptions } from "@src/utils/cookieOptions";
const loginUser: (req: Request, res: Response) => Promise<any> = async (req, res) => {
    const { username, password }: { username: string, password: string } = req.body;
    try {
        const usernameU = username.toLowerCase()
        const user = await User.findOne({ username:usernameU });
        if (!user) {
            const error = new CustomErrorClass("Invalid username or password", 400)
            throw error;
        }

        const isMatch = await bcrypt.compare(password?.trim() || "", user.password?.trim()!)
        if (!isMatch) {
            console.log("compare failed")
            const error = new CustomErrorClass("Invalid username or password/n", 400)
            throw error;
        } 
        //get user without password field
        const insertedUserStripped:UserModelType = await User.findById(user._id).select("-password");
        const stripeUserJson = insertedUserStripped.toJSON();
        //get token
        const token = generateToken(stripeUserJson._id)
        //set cookies
      // const cookies = new Cookies(req, res, {keys:[process.env.JWT_SECRET ||""]});
        res.cookie('authToken', token, cookieOptions)
        //response
        const response = {message:"Registration Completed", response:{username, _id:user._id}}
        //return response
        return res.status(200).json(response)
    }
    catch (error) {
        if (error instanceof CustomErrorClass) {
            return res.status(error.statusCode).json({message:error.message, name:error.name, stack:error.stack})
         }
       else if (error instanceof Error) {
            return res.status(500).json({message:error.message, stack:error.stack})
        }
        else {
            return res.status(500).json({ message: "An error occured" })
        }
    }

}
export default loginUser