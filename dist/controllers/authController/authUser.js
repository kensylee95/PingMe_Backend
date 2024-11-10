"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = void 0;
const userService_1 = require("../../services/userService");
const authUser = async (req, res) => {
    if (req.userId) {
        const authenticatedUser = await (0, userService_1.getUserById)(req.userId);
        authenticatedUser && res.json({ authUser: authenticatedUser.toJSON() });
    }
};
exports.authUser = authUser;
