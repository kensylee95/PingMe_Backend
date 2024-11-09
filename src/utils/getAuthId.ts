import {Socket} from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken"
import parseCookies from "./parseCookie";

export const getAuthId :(socket: Socket)=>string|null = (socket) =>  {
    // Secret key for JWT (replace with your own secret)
const JWT_SECRET = process.env.JWT_SECRET||"";
try{
const cookieFromHeader = socket.request.headers.cookie;
if (!cookieFromHeader) {
 throw new Error("No Cookie found");
}
const parsedCookies:Record<string, string | undefined> = parseCookies(cookieFromHeader);

if (!parsedCookies) {
  throw new Error("Cookie not parsed");
}
const token = parsedCookies.authToken;
if (!token) {
  throw new Error("Token not found");
}

// Verify JWT token
const decoded = jwt.verify(token, JWT_SECRET)as jwt.JwtPayload;
const authUID = decoded.userId
  return authUID;
}
catch(e){
  console.log(e)
  return null
}
}