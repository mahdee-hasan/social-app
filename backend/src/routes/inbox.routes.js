import express from "express";

// internal import
import {
  getInbox,
  sendMessage,
  getOneConversation,
  getMessage,
  addConversation,
} from "../controllers/inbox.controller.js";
import checkAuth from "../middlewares/checkAuth.js";
import { multipleUploader } from "../middlewares/UploadToCloudinary/composedUploader.js";

const router = express.Router();
//using
router.get("/conversations/:id", checkAuth, getInbox);
router.get("/conversation/:id", checkAuth, getOneConversation);
router.post(
  "/message",
  checkAuth,
  multipleUploader("messageAttachment"),
  sendMessage
);
router.get("/message/:conId", checkAuth, getMessage);
router.post("/conversation", checkAuth, addConversation);
//not using
// router.delete("/:id", checkAuth, deleteConversation);
// router.post("/searchUser", checkAuth, searchUser);
//

// router.get("/close-all-con", checkAuth, closeAllChat);
// router.get("/open-chat/:id", checkAuth, openChat);
// router.get("/close-chat/:id", checkAuth, closeChat);
// router.get("/start-typing/:id", checkAuth, startTyping);
// router.delete("/everyone/:id", checkAuth, deleteForEveryone);
// router.delete("/forMe/:id", checkAuth, deleteForME);
// router.post("/editMessage/:id", checkAuth, updateMessage);

// router.get("/last-message", checkAuth, getLastMessage);
export default router;
