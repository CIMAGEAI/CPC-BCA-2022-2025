import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesPath = path.join(__dirname, "../uploads/images/");
const pdfsPath = path.join(__dirname, "../uploads/pdfs/");

// Ensure upload folders exist, create if not
if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}
if (!fs.existsSync(pdfsPath)) {
  fs.mkdirSync(pdfsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, pdfsPath);
    } else if (file.mimetype.startsWith("image/")) {
      cb(null, imagesPath);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
});

export default upload;
