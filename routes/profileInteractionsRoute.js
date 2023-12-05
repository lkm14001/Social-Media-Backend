const Router = require("express").Router();

const User = require("../mongo/model/userModel");
const Post = require("../mongo/model/PostModel");
const Comment = require("../mongo/model/CommentModel");

Router.get("/get-updated-details", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(404).send({ success: false, error: "User not found" });
  } else {
    try {
      const updatedDetails = await User.findById(userId, {
        password: 0,
      }).populate([
        {
          path: "posts",
          populate: [
            { path: "comments", populate: [{ path: "user" }] },
            { path: "user" },
          ],
        },
        {
          path: "following",
          populate: [
            {
              path: "posts",
              populate: [
                { path: "comments", populate: [{ path: "user" }] },
                { path: "user" },
              ],
            },
          ],
        },
        { path: "followers" },
        { path: "likedPosts" },
        { path: "sentFriendRequests" },
        { path: "friendRequests" },
      ]);
      // console.log(updatedDetails)
      return res.status(200).send({ success: true, user: updatedDetails });
    } catch (error) {
      return res.status(500).send({ success: false, error: error.message });
    }
  }
});
Router.post("/:email/update-bio", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  const user = await User.findOne({ email: req.params.email }, { password: 0 });
  if (!user) {
    return res.status(404).send({ success: false, error: "User not found" });
  } else {
    try {
      await user.updateOne({ $set: { bio: req.body.bio } });
      return res.status(200).send({ success: true });
    } catch (error) {
      return res.status(500).send({ success: false, error: error.message });
    }
  }
});

Router.post("/:email/add-post", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  const user = await User.findOne({ email: req.params.email }, { password: 0 });
  if (!user) {
    return res.status(404).send({ success: false, error: "User not found" });
  } else {
    try {
      const newPost = new Post(req.body);
      newPost.save();

      await user.updateOne({ $addToSet: { posts: newPost._id } });
      return res.status(200).send({ success: true });
    } catch (error) {
      return res.status(500).send({ success: false, error: error.message });
    }
  }
});

Router.post("/:email/edit-post/:postId", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  const user = await User.findOne({ email: req.params.email }, { password: 0 });
  if (!user) {
    return res.status(404).send({ success: false, error: "User not found" });
  } else {
    try {
      const postToBeEdited = await Post.findById(req.params.postId);
      if (!postToBeEdited) {
        return res
          .status(404)
          .send({ success: false, error: "Post not found" });
      } else {
        await postToBeEdited.updateOne({ $set: req.body });
        return res.status(200).send({ success: true });
      }
    } catch (error) {
      return res.status(500).send({ success: false, error: error.message });
    }
  }
});

Router.post("/:userId/delete-post/:postId", async (req, res) => {
  if (!req.params.userId || !req.params.postId) {
    return res.status(400).send({ success: false, error: "Bad Request" });
  } else {
    if (req.params.userId === req.user) {
      try {
        await User.findByIdAndUpdate(req.params.userId, {
          $pull: { posts: req.params.postId },
        });
        await User.updateOne(
          { likedPosts: { $in: [req.params.postId] } },
          { $pull: { likedPosts: req.params.postId } }
        );
        await Comment.deleteMany({ post: req.params.postId });
        await Post.findByIdAndDelete(req.params.postId);
        return res.status(200).send({ success: true });
      } catch (error) {
        return res.status(500).send({ success: false, error: "Server Error" });
      }
    } else {
      return res.status(500).send({
        success: false,
        error: "Error occured ! Please Try again later",
      });
    }
  }
});

Router.get("/get-updated-post-details/:postId", async (req, res) => {
  try {
    const updatedPost = await Post.findById(req.params.postId);
    res.status(200).send({ success: true, updatedPost });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

Router.post("/:email/add-comment/:postId", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  const user = await User.findOne({ email: req.params.email }, { password: 0 });
  if (!user) {
    return res.status(404).send({ success: false, error: "User not found" });
  } else {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res
          .status(404)
          .send({ success: false, error: "Post not found" });
      } else {
        const commentBody = {
          comment: req.body.comment,
          user: user._id,
          post: post._id,
        };
        const newComment = new Comment(commentBody);
        newComment.save();
        await post.updateOne({ $addToSet: { comments: newComment._id } });
        return res.status(200).send({ success: true });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  }
});

Router.post("/:email/likePost/:postId", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  const user = await User.findOne({ email: req.params.email }, { password: 0 });
  if (!user) {
    return res.status(404).send({ success: false, error: "User not found" });
  } else {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res
          .status(404)
          .send({ success: false, error: "Post not found" });
      } else {
        await post.updateOne({ $addToSet: { likes: user._id } });
        await user.updateOne({ $addToSet: { likedPosts: post._id } });
        return res.status(200).send({ success: true });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  }
});

Router.post("/:email/removeLike/:postId", async (req, res) => {
  const user = await User.findOne({ email: req.params.email }, { password: 0 });
  if (!user) {
    return res.status(404).send({ success: false, error: "User not found" });
  } else {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res
          .status(404)
          .send({ success: false, error: "Post not found" });
      } else {
        await post.updateOne({ $pull: { likes: user._id } });
        await user.updateOne({ $pull: { likedPosts: post._id } });
        return res.status(200).send({ success: true });
      }
    } catch (error) {
      return res.status(500).send({ success: false, error: error.message });
    }
  }
});

Router.post("/:userId/send-friend-request/:friendId", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) {
      return res
        .status(404)
        .json({ success: false, error: "User or Friend Not Found" });
    } else {
      await friend.updateOne({ $addToSet: { friendRequests: user._id } });
      await user.updateOne({ $addToSet: { sentFriendRequests: friend._id } });
      await user.updateOne({ $addToSet: { following: friend._id } });
      return res.status(200).send({ success: true });
    }
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

Router.post("/:userId/accept-friend-request/:friendId", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);

    await user.updateOne({ $pull: { friendRequests: friend._id } });
    await user.updateOne({ $addToSet: { followers: friend._id } });
    await user.updateOne({ $addToSet: { following: friend._id } });

    await friend.updateOne({ $pull: { sentFriendRequests: user._id } });
    await friend.updateOne({ $addToSet: { followers: user._id } });

    return res.status(200).send({ success: true });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

Router.post("/:userId/ignore-friend-request/:friendId", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);

    await user.updateOne({ $pull: { friendRequests: friend._id } });
    await friend.updateOne({ $pull: { sentFriendRequests: user._id } });

    return res.status(200).send({ success: true });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

Router.post("/:userId/remove-friend/:friendId", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);

    await user.updateOne({ $pull: { followers: friend._id } });
    await user.updateOne({ $pull: { following: friend._id } });
    await friend.updateOne({ $pull: { followers: user._id } });
    await friend.updateOne({ $pull: { following: user._id } });

    return res.status(200).send({ success: true });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

Router.get("/search/:searchData", async (req, res) => {
  try {
    const usersData = await User.find(
      {
        $or: [
          { firstName: { $regex: new RegExp(req.params.searchData, "i") } },
          { lastName: { $regex: new RegExp(req.params.searchData, "i") } },
          { username: { $regex: new RegExp(req.params.searchData, "i") } },
        ],
      },
      { password: 0 }
    );
    return res.status(200).send({ success: true, users: usersData });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

Router.get("/get-user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, {
      password: 0,
      likePosts: 0,
      updatedAt: 0,
    });
    if (!user) {
      return res.status(404).send({ success: false, error: "User Not Found!" });
    } else {
      const userData = await User.findById(req.params.userId, {
        password: 0,
      }).populate([
        {
          path: "posts",
          populate: [
            { path: "comments", populate: [{ path: "user" }] },
            { path: "user" },
          ],
        },
        {
          path: "following",
          populate: [
            {
              path: "posts",
              populate: [
                { path: "comments", populate: [{ path: "user" }] },
                { path: "user" },
              ],
            },
          ],
        },
        { path: "followers" },
        { path: "likedPosts" },
        { path: "sentFriendRequests" },
        { path: "friendRequests" },
      ]);
      return res.status(200).send({ success: true, user: userData });
    }
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

Router.get("/");

module.exports = Router;
