const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/webm"];

const fileFilter = (req, file, cb) => {
  if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    cb(new Error("Only MP4, MPEG, and WebM video types are allowed."));
  }
};

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const uploadVideo = multer({
    storage: videoStorage,
    fileFilter: fileFilter,
});

module.exports = { uploadVideo };
