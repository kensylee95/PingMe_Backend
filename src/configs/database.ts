import mongoose from "mongoose";

export const connectDatabase = async () => {
    const mongooseURI: string = process.env.MONGOOSE_URI || "";
    try {
        await mongoose.connect(mongooseURI);
        console.log("[MongoDB]: Database Connected");
    } catch (err) {
        console.log("Could not connect to MongoDB", err);
    }
};
