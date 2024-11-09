import express from 'express';
import * as messageController from "@controllers/messageController"
import authMiddleware from 'src/middlewares/authMiddleware';
const router = express.Router();
router.get("/:chatId", authMiddleware, messageController.getMessages);
router.post("/", authMiddleware, messageController.sendMessage);
export default router;