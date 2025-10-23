const express = require("express");
const checkAuth = require("../middlewares/common/checkAuth");
const {
  getFeed,
  addPost,
  addLike,
  removeLike,
  getSpecificPost,
  getSpecificComments,
  addComments,
  updateComment,
  deleteComment,
  replyComments,
  addCommentLike,
  removeCommentLike,
  deletePost,
  editPost,
} = require("../controllers/feedsController");
const attachmentUploader = require("../middlewares/inbox/attachmentUploader");
const postToCloud = require("../middlewares/feeds/postToCloud");
const {
  postValidator,
  postValidationHandler,
} = require("../middlewares/feeds/PostValidator");
const postUploader = require("../middlewares/feeds/postUploader");
const router = express.Router();

router.get("/", getFeed);
router.post(
  "/",
  checkAuth,
  postUploader,
  postValidator,
  postValidationHandler,
  (req, res, next) => {
    console.log(req.body);
  },
  addPost
);
router.get("/likes", checkAuth, addLike);
router.get("/undo-likes", checkAuth, removeLike);
router.get("/post/:id", checkAuth, getSpecificPost);
router.get("/comments/:postId", checkAuth, getSpecificComments);
router.post("/comments/:postId", checkAuth, addComments);
router.put("/update-comment/:id", checkAuth, updateComment);
router.post("/reply-comment/:id", checkAuth, replyComments);
router.delete("/comment/:id", checkAuth, deleteComment);
router.get("/commentLikes", checkAuth, addCommentLike);
router.get("/undo-commentLikes", checkAuth, removeCommentLike);
router.put(
  "/post/:id",
  checkAuth,
  postValidator,
  postValidationHandler,
  attachmentUploader,
  postToCloud,
  editPost
);
router.delete("/post/:id", checkAuth, deletePost);
//export the router
module.exports = router;
