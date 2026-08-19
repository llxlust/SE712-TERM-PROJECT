// middleware/upload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = (folder = "uploads") => {
  const uploadDir = path.join(process.cwd(), "public", folder);

  // สร้าง folder ถ้ายังไม่มี
  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);

      const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

      cb(null, filename);
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

module.exports = upload;
