// multer.middleware.ts

import multer from 'multer';
import path from 'path';

// Define storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/temp'); // Directory to store the files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use original filename
  }
});

// Create multer instance with storage options
const upload = multer({ storage });

export default upload;
