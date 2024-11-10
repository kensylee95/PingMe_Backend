"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const cookieOptions_1 = require("../../utils/cookieOptions");
const logout = (req, res) => {
    // Clear the 'jwt' cookie by setting its expiration to a past date
    res.clearCookie('authToken', cookieOptions_1.cookieOptions);
    // Send a response indicating that the user has been logged out
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
exports.logout = logout;
