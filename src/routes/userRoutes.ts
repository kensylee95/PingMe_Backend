import express from 'express';
import * as userController from "@controllers/userController"
import authMiddleware from '@middlewares/authMiddleware';
const router = express.Router();
router.get("/id/:id", authMiddleware, userController.getUser);
router.get("/username/:username", authMiddleware, userController.getUserByUsername);
router.get("/search", authMiddleware, userController.searchUsers);
export default router;