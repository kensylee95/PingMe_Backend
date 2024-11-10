import { CookieOptions } from "express";

export const cookieOptions:CookieOptions={
    httpOnly: true, // Ensures the cookie can't be accessed via JavaScript
    secure: true, // Ensures the cookie is sent over HTTPS
    sameSite: 'none', // Allows the cookie to be sent in cross-origin requests
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
}