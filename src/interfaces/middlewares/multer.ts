import multer from "multer";

const storage = multer.memoryStorage()
export const uploads = multer({storage: storage}).fields([
    { name: "images", maxCount: 6 }, // Up to 6 image files
    { name: "audio", maxCount: 1 }, // Only 1 audio file
  ]);