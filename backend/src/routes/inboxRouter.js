const express = require("express");
const router = express.Router();
// internal import
const {
  getInbox,
  searchUser,
  addConversation,
  deleteConversation,
  sendMessage,
  getMessage,
  getLastMessage,
  deleteForEveryone,
  updateMessage,
  deleteForME,
  openChat,
  closeChat,
  closeAllChat,
  startTyping,
  getOneConversation,
} = require("../controllers/inboxController");
const checkAuth = require("../middlewares/common/checkAuth");
const attachmentUploader = require("../middlewares/inbox/attachmentUploader");
const attachToCloud = require("../middlewares/inbox/attachToCloud");

router.get("/conversations/:id", checkAuth, getInbox);
router.get("/conversation/:id", checkAuth, getOneConversation);
router.delete("/:id", checkAuth, deleteConversation);
router.post("/searchUser", checkAuth, searchUser);
router.post("/conversation", checkAuth, addConversation);
router.post(
  "/message",
  checkAuth,
  attachmentUploader,
  attachToCloud,
  sendMessage
);
router.get("/close-all-con", checkAuth, closeAllChat);
router.get("/open-chat/:id", checkAuth, openChat);
router.get("/close-chat/:id", checkAuth, closeChat);
router.get("/start-typing/:id", checkAuth, startTyping);
router.delete("/everyone/:id", checkAuth, deleteForEveryone);
router.delete("/forMe/:id", checkAuth, deleteForME);
router.post("/editMessage/:id", checkAuth, updateMessage);
router.get("/message/:conversation_id", checkAuth, getMessage);
router.get("/last-message", checkAuth, getLastMessage);
module.exports = router;
