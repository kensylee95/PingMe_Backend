"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCookies = void 0;
const parseCookies = (cookieString) => {
    const cookies = {};
    // Split cookie string by semicolons
    const cookieArray = cookieString.split(';');
    cookieArray.forEach(cookie => {
        // Trim leading/trailing spaces from each cookie
        const trimmedCookie = cookie.trim();
        // Skip empty cookies (just in case)
        if (!trimmedCookie)
            return;
        // Split the cookie into name and value
        const [name, ...valueParts] = trimmedCookie.split('=');
        // If no equals sign is found, treat it as a cookie without a value (e.g., 'name')
        const value = valueParts.join('='); // To handle the case of multiple equals signs in the value
        // Decode the cookie value if it exists
        cookies[name] = decodeURIComponent(value || '');
    });
    return cookies;
};
exports.parseCookies = parseCookies;
exports.default = exports.parseCookies;
