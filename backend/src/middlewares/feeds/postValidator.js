const { body, validationResult } = require("express-validator");
const cloudinary = require("../../config/cloudinaryConfig");

const postValidator = [
  body("text")
    .default("")
    .isString()
    .isLength({ max: 500 })
    .withMessage("Text can be maximum 500 characters"),

  body("privacy")
    .default("public")
    .isIn(["public", "private", "friends"])
    .withMessage("Privacy must be either public, private or friends"),

  body("isEnableComments")
    .default(true)
    .isBoolean()
    .withMessage("isEnableComments must be a boolean"),
];

const postValidationHandler = async (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    return next();
  }
  const uploadedFiles = req.uploadedFiles;

  try {
    const deleteResults = await Promise.all(
      uploadedFiles.map((f) => cloudinary.uploader.destroy(f.public_id))
    );

    console.log("Delete results:", deleteResults);
  } catch (err) {
    console.error("Error deleting from Cloudinary:", err);
  }
  return res.status(400).json({
    errors: mappedErrors,
  });
};

module.exports = {
  postValidator,
  postValidationHandler,
};
