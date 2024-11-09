import { Request, Response } from "express";

export const logout:(req:Request, res:Response)=>void = (req, res) => {
    // Clear the 'jwt' cookie by setting its expiration to a past date
    res.clearCookie('authToken', {
        httpOnly: true, // Important to make it inaccessible to JavaScript
        secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
        sameSite: "lax", // CSRF protection
        path: '/', // Make sure it's cleared across the entire domain
    });

    // Send a response indicating that the user has been logged out
    return res.status(200).json({ success: true, message: 'Logged out successfully' })
}
