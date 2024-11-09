import jwt from "jsonwebtoken"
export const generateToken:(userId: string)=>string = (userId)=>{
    const JWT_SECRET:string|undefined = process.env.JWT_SECRET
    const token:string = jwt.sign({userId}, JWT_SECRET!, {expiresIn:"2days"});
    return token;
}