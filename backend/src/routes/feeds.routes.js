import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import { getFeed, addPost } from "../controllers/feeds.controller.js";

const router = express.Router();

router.get("/", getFeed);
// router.post(
//   "/",
//   checkAuth,
//   postUploader,
//   postValidator,
//   postValidationHandler,
//   (req, res, next) => {
//     console.log(req.body);
//   },
//   addPost
// );

// router.get("/likes", checkAuth, addLike);
// router.get("/undo-likes", checkAuth, removeLike);
// router.get("/post/:id", checkAuth, getSpecificPost);
// router.get("/comments/:postId", checkAuth, getSpecificComments);
// router.post("/comments/:postId", checkAuth, addComments);
// router.put("/update-comment/:id", checkAuth, updateComment);
// router.post("/reply-comment/:id", checkAuth, replyComments);
// router.delete("/comment/:id", checkAuth, deleteComment);
// router.get("/commentLikes", checkAuth, addCommentLike);
// router.get("/undo-commentLikes", checkAuth, removeCommentLike);
// router.put(
//   "/post/:id",
//   checkAuth,
//   postValidator,
//   postValidationHandler,

//   editPost
// );
// router.delete("/post/:id", checkAuth, deletePost);
// //export the router
export default router;
