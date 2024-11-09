// src/types/express.d.ts
import { Request } from 'express';
console.log("Express type augmentations loaded!");
declare global {
  namespace Express {
    interface Request {
      userId?: string;  // Assuming userId is a string, you can adjust the type if needed
    }
  }
}

// **Synthetic error to test if the file is loaded**
type TestType = "This is a test";  // <- TypeScript should throw an error here if the file is not loaded.