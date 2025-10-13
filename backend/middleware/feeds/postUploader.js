const cloudUploader = require("../../utilities/cloudUploader");
const cloudinary = require("../../cloudinaryConfig");

const postUploader = (req, res, next) => {
  const upload = cloudUploader(
    ["image/jpeg", "image/jpg", "image/png"],
    5_000_000,
    "Only .jpg, .jpeg, .png formats allowed!"
  );

  upload.array("files", 5)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        errors: {
          attachment: err.message,
        },
      });
    }

    try {
      if (!req.files) return next();

      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "posts" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);
      req.uploadedFiles = results;

      next();
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        errors: {
          attachment: error.message,
        },
      });
    }
  });
};

module.exports = postUploader;
