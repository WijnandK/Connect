const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

router.post(
  "/",
  [
    auth,
    [
      check("text", "text required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const { text } = req.body;

      const newPost = new Post({
        text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      await newPost.save();

      return res.json(newPost);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server error");
    }
  }
);
//  /api/posts                Get ALL Posts !

router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.find({}).sort({ date: -1 });
    return res.json(allPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

// api/posts/id

router.get("/:postId", auth, async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    return res.json(post);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    console.log(err);
    return res.status(500).send("Server error");
  }
});

// /api/posts/delete/postId    DELETE POST BY ID
router.delete("/:postId", auth, async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Not your post" });
    }
    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    console.log(err);
    return res.status(500).send("Server error");
  }
});

// /api/posts/like/:id        ADDS LIKE FROM USER TO POST

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// /api/posts/unlike/:id         UNLIKE FROM USER TO POST
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// PUT / api/posts/comment/:id

router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "text required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const postId = req.params.id;
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(postId);
      const { text } = req.body;

      const newComment = {
        text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server error");
    }
  }
);

// Delete // api/posts/comment/:postId/:id

router.delete("/comment/:postId/:commentId", auth, async (req, res) => {
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const userId = req.user.id;
  try {
    const post = await Post.findById(postId);
    const comments = post.comments;

    const comment = comments.find(com => {
      return com.id.toString() === commentId.toString();
    });
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    if (comment.user.toString() !== userId.toString()) {
      return res.status(404).json({ msg: "You are not allowed" });
    }

    const newComments = comments.filter(comment => {
      return comment.id !== commentId;
    });
    post.comments = newComments;
    await post.save();

    return res.json(post.comments);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.log(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
