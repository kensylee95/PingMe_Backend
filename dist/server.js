"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./configs/database");
const cors_1 = __importDefault(require("cors"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const websocketService_1 = require("./services/websocketService");
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || 3001;
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const crossOriginSetup = {
    origin: process.env.CLIENT_ORIGIN || "",
    methods: ['GET', 'POST',],
    credentials: true,
};
//Socket.io
const socketIO = new socket_io_1.Server(server, {
    cors: crossOriginSetup,
});
//App Cors setup
app.use((0, cors_1.default)(crossOriginSetup));
// WebSocket setup
(0, websocketService_1.initializeWebSocketServer)(socketIO);
app.use((0, cors_1.default)(crossOriginSetup));
// Database connection
(0, database_1.connectDatabase)();
//routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/chats", chatRoutes_1.default);
app.use("/api/messages", messageRoutes_1.default);
server.listen(port, () => {
    console.log(`[Server]: Server is running at http://localhost:${port}`);
});
