"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomErrorClass extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.default = CustomErrorClass;
