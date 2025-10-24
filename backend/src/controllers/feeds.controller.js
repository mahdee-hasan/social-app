import People from "../models/people.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notifications.model.js";
import Comment from "../models/comment.model.js";
const getFeed = async (req, res, next) => {
  try {
    const posts = await Post.find({ privacy: "public" })
      .populate("author")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addPost = async (req, res, next) => {
  try {
    const user = await People.findOne({ uid: req.user.uid });
    const newPost = new Post({
      text: req.body.text,
      images: req.uploadedFiles,
      author: user._id,
      mentioned_people: req.body.mentioned_people,
      privacy: req.body.privacy,
      isEnableComments: req.body.isEnableComments,
    });
    const data = await newPost.save();

    const newNotification = new Notification({
      title: "new Post",
      description: `${req.user.username} added a Post`,
      author: user.friends,
      pic: user.avatar,
      link: `/Post-details/${data._id}`,
    });
    const notificationObject = await newNotification.save();
    global.io.emit("new_notification", notificationObject);
    res.status(201).json(data);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "server side error", error: error.message });
  }
};
const addLike = async (req, res, next) => {
  try {
    const user = await People.findById(req.user.userId, "avatar");

    const selectedPost = await Post.findByIdAndUpdate(
      req.query.postId,
      {
        $addToSet: { likes: req.user.userId },
      },
      { new: true }
    );
    if (selectedPost.author.id.toString() !== req.user.userId) {
      const newNotification = new Notification({
        title: "new like on your Post",
        description: `${req.user.username} liked your Post`,
        author: [selectedPost.author.id],
        pic: user.avatar,
        link: `/Post-details/${selectedPost._id}`,
      });
      const notificationObject = await newNotification.save();
      global.io.emit("new_notification", notificationObject);
    }
    res.status(200).json({ success: true, message: "liked successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "error liking Post" });
  }
};
const removeLike = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.query.postId, {
      $pull: { likes: req.user.userId },
    });

    res.status(200).json({ success: true, message: "unLiked successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "error liking Post" });
  }
};
const getSpecificPost = async (req, res, next) => {
  try {
    const specificPost = await Post.findById(req.params.id);
    if (specificPost) {
      res.status(200).json(specificPost);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "error finding Post" });
  }
};
const getSpecificComments = async (req, res, next) => {
  try {
    const specificComments = await Comment.find({
      post_id: req.params.postId,
    }).sort("createdAt");
    if (specificComments) {
      res.status(200).json(specificComments);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "error finding Comment" });
  }
};
const addComments = async (req, res, next) => {
  try {
    const user = await People.findById(req.user.userId, "avatar");
    const commentData = new Comment({
      ...req.body,
      post_id: req.params.postId,
      author: {
        id: req.user.userId,
        name: req.user.username,
        avatar: user.avatar,
      },
    });
    const newComment = await commentData.save();

    const selectedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $addToSet: { comments: newComment._id },
      },
      { new: true }
    );
    const comments = await Comment.find({ post_id: req.params.postId }).sort(
      "createdAt"
    );

    if (!selectedPost.author.id.equals(req.user.userId)) {
      const newNotification = new Notification({
        title: "new Comment",
        description: `${req.user.username} commented on your Post`,
        author: [selectedPost.author.id],
        pic: user.avatar,
        link: `/Post-details/${req.params.postId}`,
      });
      const notificationObject = await newNotification.save();
      global.io.emit("new_notification", notificationObject);
    }

    res.status(200).json(comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
const updateComment = async (req, res, next) => {
  try {
    const selectedComment = await Comment.findById(req.params.id);
    await Comment.findByIdAndUpdate(req.params.id, {
      $set: {
        text: req.body.text,
        edited: true,
      },
      $addToSet: { old_text: selectedComment.text },
    });
    const allComments = await Comment.find({
      post_id: selectedComment.post_id,
    });
    res.status(200).json(allComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteComment = async (req, res, next) => {
  try {
    const selectedComment = await Comment.findById(req.params.id);

    if (selectedComment && selectedComment.isReply) {
      await Comment.findByIdAndUpdate(selectedComment.isReply, {
        $pull: { replies: selectedComment._id },
      });
    } else if (selectedComment && selectedComment.replies.length > 0) {
      await Promise.all(
        selectedComment.replies.map((replyId) =>
          Comment.findByIdAndDelete(replyId)
        )
      );
    } else if (!selectedComment) {
      res.status(404).json({ error: "Comment not found" });
    }
    await Post.findByIdAndUpdate(selectedComment.post_id, {
      $pull: { comments: selectedComment._id },
    });
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const replyComments = async (req, res, next) => {
  try {
    const user = await People.findById(req.user.userId, "avatar");
    const mainComment = await Comment.findById(req.params.id).populate(
      "post_id"
    );

    const postAuthorId = mainComment.post_id.author.id;

    const commentData = new Comment({
      ...req.body,
      post_id: mainComment.post_id._id,
      author: {
        id: req.user.userId,
        name: req.user.username,
        avatar: user.avatar,
      },
      isReply: mainComment._id,
    });

    const reply = await commentData.save();

    await Comment.findByIdAndUpdate(req.params.id, {
      $addToSet: { replies: reply._id },
    });

    const comments = await Comment.find({
      post_id: mainComment.post_id._id,
    }).sort("createdAt");

    if (
      postAuthorId !== req.user.userId &&
      mainComment.author.id !== req.user.userId
    ) {
      const newNotification = new Notification({
        title: "comments reply",
        description: `${req.user.username} replied to a Comment`,
        author: [
          postAuthorId.toString() !== req.user.userId ? postAuthorId : null,
          mainComment.author.id.toString() !== req.user.userId
            ? mainComment.author.id
            : null,
        ].filter(Boolean),
        pic: user.avatar,
        link: `/Post-details/${mainComment.post_id._id}`,
      });

      const notificationObject = await newNotification.save();
      global.io.emit("new_notification", notificationObject);
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCommentLike = async (req, res, next) => {
  try {
    const user = await People.findById(req.user.userId, "avatar");
    const selectedComment = await Comment.findByIdAndUpdate(
      req.query.commentId,
      {
        $addToSet: { likes: req.user.userId },
      },
      { new: true }
    );
    if (selectedComment.author.id.toString() !== req.user.userId) {
      const newNotification = new Notification({
        title: "new like on your Comment",
        description: `${req.user.username} liked your Comment`,
        author: [selectedComment.author.id],
        pic: user.avatar,
        link: `/Post-details/${selectedComment.post_id}`,
      });
      const notificationObject = await newNotification.save();
      global.io.emit("new_notification", notificationObject);
    }
    res.status(200).json({ success: true, message: "liked successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "error liking Comment" });
  }
};
const removeCommentLike = async (req, res, next) => {
  try {
    await Comment.findByIdAndUpdate(req.query.commentId, {
      $pull: { likes: req.user.userId },
    });

    res.status(200).json({ success: true, message: "unLiked successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "error liking Comment" });
  }
};
const deletePost = async (req, res, next) => {
  try {
    const selectedPost = await Post.findById(req.params.id);
    if (!selectedPost) {
      res
        .status(404)
        .json({ error: "Post not found", success: false, message: null });
    } else {
      await Promise.all([
        Post.findByIdAndDelete(req.params.id),
        Comment.deleteMany({ post_id: selectedPost._id }),
      ]);

      res
        .status(200)
        .json({ error: null, success: true, message: "successfully deleted" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message || "server error",
      success: false,
      message: null,
    });
  }
};

const editPost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
        images: req.uploadedFiles,
        privacy: req.body.privacy,
        isEnableComments: req.body.isEnableComments,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).json(updatedPost);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "server side error", error: error.message });
  }
};
export {
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
};
