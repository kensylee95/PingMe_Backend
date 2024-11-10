"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authUser_1 = require("../controllers/authController/authUser");
const login_1 = __importDefault(require("../controllers/authController/login"));
const logout_1 = require("../controllers/authController/logout");
const register_1 = __importDefault(require("../controllers/authController/register"));
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("src/middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post("/register", register_1.default);
router.post("/login", login_1.default);
router.get("/logout", logout_1.logout);
router.get("/authUser", authMiddleware_1.default, authUser_1.authUser);
exports.default = router;
