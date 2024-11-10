"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    const mongooseURI = process.env.MONGOOSE_URI || "";
    try {
        await mongoose_1.default.connect(mongooseURI);
        console.log("[MongoDB]: Database Connected");
    }
    catch (err) {
        console.log("Could not connect to MongoDB", err);
    }
};
exports.connectDatabase = connectDatabase;
