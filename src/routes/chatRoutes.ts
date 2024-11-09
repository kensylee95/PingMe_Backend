import express from 'express';
import * as chatControler from "@controllers/chatController"
import authMiddleware from 'src/middlewares/authMiddleware';
const router = express.Router();
router.get("/user", authMiddleware, chatControler.getUserChats);
router.post("/createChat", authMiddleware, chatControler.createChat);
export default router;