import multer from "multer";
import path from "path";
import { v4 as UUIDV4 } from "uuid";
import fs from 'fs';

function createUploadMiddleware() {
  const uploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueName = `${UUIDV4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
  const upload = multer({ storage });

  return upload;
}

export default createUploadMiddleware();
