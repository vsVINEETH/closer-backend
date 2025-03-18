import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../../infrastructure/config/s3";
import { Request, Response } from "express";
import { FileFilterCallback } from "multer";


// Define custom types for the file upload (optional, but helpful)
interface File {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  location?: string; // For storing the S3 location of the uploaded file
}

// Multer middleware configuration
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "closer-project-uploads",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req: Request, file: File, cb: (error: any, metadata?: any) => void): void {
      cb(null, { fieldName: file.fieldname });
    },
    key(req: Request, file: File, cb: (error: any, key?: string) => void): void {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // Max file size 10MB
  },
  fileFilter(req: Request, file: File, cb: FileFilterCallback): void {
    if (
      file.mimetype.startsWith("image/") || // Allow image files
      file.mimetype.startsWith("audio/")   // Allow audio files
    ) {
      cb(null, true);
    } else {
      const error = new Error("Only image and audio files are allowed!")
      cb(error as any, false);
    }
  },
}).fields([
  { name: "images", maxCount: 6 }, // Up to 6 image files
  { name: "audio", maxCount: 1 }, // Only 1 audio file
]);
