import cloudinary from "../../config/cloudinaryConfig.js";

const cloudinaryUpload = (folder) => async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (!files.length) return next();

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder }, (err, result) => {
            if (err) return reject(err);
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          })
          .end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    // Store results in req for later use
    req.uploadArray = results;
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Failed to upload to Cloudinary" });
  }
};
export { cloudinaryUpload };
