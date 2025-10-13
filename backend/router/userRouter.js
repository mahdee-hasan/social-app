const express = require("express");
const checkAuth = require("../middleware/common/checkAuth");
const coverUpload = require("../middleware/common/user/coverUploader");
const cloudinaryCoverUploader = require("../utilities/coverUploaderToCloud");
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
const avatarUpload = require("../middleware/common/users/avatarUploads");
const cloudinaryUploader = require("../utilities/cloudinaryUploader");
const {
  updateNameValidationHandler,
  updateNameValidator,
} = require("../middleware/common/user/nameValidator");
const {
  updateDobValidator,
  updateDobValidationHandler,
} = require("../middleware/common/user/dobUpdateValidator");
const {
  updateLocationValidator,
  updateLocationValidationHandler,
} = require("../middleware/common/user/locationValidator");
const {
  updateWebsiteValidator,
  updateWebsiteValidationHandler,
} = require("../middleware/common/user/websiteValidators");

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
