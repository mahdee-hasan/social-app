const cloudinary = require("../config/cloudinaryConfig");
const express = require("express");
const {
  getUsers,
  addUser,
  deleteUser,
  addFireBaseUser,
} = require("../controllers/usersController");
const avatarUpload = require("../middlewares/common/users/avatarUploads");
const {
  addUserValidator,
  addUserValidationHandler,
} = require("../middlewares/common/users/userValidators");
const checkAuth = require("../middlewares/common/checkAuth");
const cloudinaryUploader = require("../utils/cloudinaryUploader");

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
