import express from "express";
import { getUsers, addFireBaseUser } from "../controllers/users.controller.js";

import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.get("/", checkAuth, getUsers);
router.post("/create", addFireBaseUser);

// router.delete("/:id", checkAuth, deleteUser);

export default router;
