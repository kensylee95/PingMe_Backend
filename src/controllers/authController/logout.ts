import { cookieOptions } from "@src/utils/cookieOptions";
import { Request, Response } from "express";

export const logout:(req:Request, res:Response)=>void = (req, res) => {
    // Clear the 'jwt' cookie by setting its expiration to a past date
    res.clearCookie('authToken', cookieOptions);

    // Send a response indicating that the user has been logged out
    return res.status(200).json({ success: true, message: 'Logged out successfully' })
}
