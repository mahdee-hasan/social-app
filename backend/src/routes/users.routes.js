import express from "express";
import {
  getUsers,
  addUser,
  deleteUser,
  addFireBaseUser,
} from "../controllers/users.controller.js";

import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.get("/", checkAuth, getUsers);
router.post("/create", addFireBaseUser);
// router.post(
//   "/",
//   checkAuth,
//   avatarUpload,
//   cloudinaryUploader,
//   addUserValidator,
//   addUserValidationHandler,
//   addUser
// );

// router.delete("/:id", checkAuth, deleteUser);

export default router;
