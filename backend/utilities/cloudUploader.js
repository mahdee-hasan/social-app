const multer = require("multer");

const cloudUploader = (allowed_file_type, max_file_size, error_msg) => {
  // IMPORTANT: Use memory storage so file.buffer exists
  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    limits: { fileSize: max_file_size },
    fileFilter: (req, file, cb) => {
      if (allowed_file_type.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(error_msg));
      }
    },
  });

  return upload;
};

module.exports = cloudUploader;
