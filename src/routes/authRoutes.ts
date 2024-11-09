import { authUser } from '@controllers/authController/authUser';
import loginUser from '@controllers/authController/login';
import { logout } from '@controllers/authController/logout';
import registerUser from '@controllers/authController/register';
import express from 'express';
import authMiddleware from 'src/middlewares/authMiddleware';
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/authUser", authMiddleware, authUser);
export default router;