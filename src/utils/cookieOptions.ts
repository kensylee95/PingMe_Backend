import { CookieOptions } from "express";

export const cookieOptions:CookieOptions={
    httpOnly:true,
    secure: true,//process.env.NODE_ENV==='production',
    sameSite: "none"
}