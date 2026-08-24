import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create an absolute uploads directory
const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});
