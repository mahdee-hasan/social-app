const cloudinary = require("../cloudinaryConfig");
const express = require("express");
const {
  getUsers,
  addUser,
  deleteUser,
  addFireBaseUser,
} = require("../controllers/usersController");
const avatarUpload = require("../middleware/common/users/avatarUploads");
const {
  addUserValidator,
  addUserValidationHandler,
} = require("../middleware/common/users/userValidators");
const checkAuth = require("../middleware/common/checkAuth");
const cloudinaryUploader = require("../utilities/cloudinaryUploader");

const router = express.Router();

router.get("/", checkAuth, getUsers);

router.post(
  "/",
  checkAuth,
  avatarUpload,
  cloudinaryUploader,
  addUserValidator,
  addUserValidationHandler,
  addUser
);
router.post("/create", addFireBaseUser);
router.delete("/:id", checkAuth, deleteUser);

module.exports = router;
