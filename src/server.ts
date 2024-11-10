import express, { Express } from "express";
import http from 'http';
import dotenv from "dotenv";
import { connectDatabase } from "@configs/database";
import cors from "cors";
import chatRoutes from "@routes/chatRoutes";
import messageRoutes from "@routes/messageRoutes";
import userRoutes from "@routes/userRoutes";
import authRoutes from "@routes/authRoutes";
import { initializeWebSocketServer } from "@services/websocketService";
import { Server as SocketIO } from "socket.io";
import cookieParser from "cookie-parser";
dotenv.config();

const app: Express = express();
const server: http.Server = http.createServer(app)
const port = process.env.PORT || 3001;


// Middleware
app.use(express.json());
app.use(cookieParser())

const crossOriginSetup:cors.CorsOptions = {
    origin: process.env.CLIENT_ORIGIN||"",
    methods: ['GET', 'POST',],
    credentials: true,
};

//Socket.io
const socketIO = new SocketIO(server, {
    cors: crossOriginSetup,
});

//App Cors setup
app.use(cors(crossOriginSetup))


// WebSocket setup
initializeWebSocketServer(socketIO);

app.use(cors(crossOriginSetup))

// Database connection
connectDatabase();

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
server.listen(port, () => {
    console.log(`[Server]: Server is running at http://localhost:${port}`);
});

