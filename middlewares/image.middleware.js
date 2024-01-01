const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    cb(new Error("Only JPEG, JPG, and PNG file types are allowed."));
  }
};

const ImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const uploadImage = multer({
    storage: ImageStorage,
    fileFilter: fileFilter,
});

module.exports = { uploadImage };
