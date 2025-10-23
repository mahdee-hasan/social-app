const express = require("express");
const checkAuth = require("../middlewares/common/checkAuth");
const coverUpload = require("../middlewares/common/user/coverUploader");
const cloudinaryCoverUploader = require("../utils/coverUploaderToCloud");
const {
  setCover,
  setAvatar,
  getPost,
  getFriends,
  getFriendsSuggestion,
  doFriendRequest,
  getFriendRequest,
  getRequestedFriend,
  acceptFriendRequest,
  rejectFriend,
  removeFriend,
  undoFriendRequest,
  updateName,
  updateDob,
  updateLocation,
  updateWebsite,
  getNotifications,
  getUnreadCounts,
  getMe,
  getOtherUser,
} = require("../controllers/userController");
const avatarUpload = require("../middlewares/common/users/avatarUploads");
const cloudinaryUploader = require("../utils/cloudinaryUploader");
const {
  updateNameValidationHandler,
  updateNameValidator,
} = require("../middlewares/common/user/nameValidator");
const {
  updateDobValidator,
  updateDobValidationHandler,
} = require("../middlewares/common/user/dobUpdateValidator");
const {
  updateLocationValidator,
  updateLocationValidationHandler,
} = require("../middlewares/common/user/locationValidator");
const {
  updateWebsiteValidator,
  updateWebsiteValidationHandler,
} = require("../middlewares/common/user/websiteValidators");

const router = express.Router();

router.get("/", checkAuth, getMe);

router.get("/get-user/:uid", checkAuth, getOtherUser);
router.post(
  "/cover",
  checkAuth,
  coverUpload,
  cloudinaryCoverUploader,
  setCover
);
router.get("/friends", checkAuth, getFriends);
router.get("/friend-request", checkAuth, getFriendRequest);
router.get("/requested-friend", checkAuth, getRequestedFriend);
router.post("/friends", checkAuth, doFriendRequest);
router.post("/accept-friend", checkAuth, acceptFriendRequest);
router.delete("/reject-friend/:id", checkAuth, rejectFriend);
router.delete("/remove-friend/:id", checkAuth, removeFriend);
router.delete("/undo-friend-request/:id", checkAuth, undoFriendRequest);
router.get("/friends-suggestion", checkAuth, getFriendsSuggestion);
router.post("/avatar", checkAuth, avatarUpload, cloudinaryUploader, setAvatar);
router.get("/post/:id", checkAuth, getPost);
router.put(
  "/update-name",
  checkAuth,
  updateNameValidator,
  updateNameValidationHandler,
  updateName
);
router.put(
  "/update-dob",
  checkAuth,
  updateDobValidator,
  updateDobValidationHandler,
  updateDob
);
router.put(
  "/update-location",
  checkAuth,
  updateLocationValidator,
  updateLocationValidationHandler,
  updateLocation
);
router.put(
  "/update-website",
  checkAuth,
  updateWebsiteValidator,
  updateWebsiteValidationHandler,
  updateWebsite
);
router.get("/notifications", checkAuth, getNotifications);
router.get("/unread-counts", checkAuth, getUnreadCounts);
module.exports = router;
