const Router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../mongo/model/userModel");

Router.post("/login", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  const userData = req.body;
  if (!userData) {
    res.status(404).send({ success: false, error: "No data provided" });
  } else {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, error: "Not Valid Credentials" });
    } else {
      const isPasswordMatch = await user.comparePassword(userData.password);
      if (isPasswordMatch) {
        // jwt access token

        // send response
        try {
          const loggedInUser = await User.findOne(
            { email: userData.email },
            { password: 0 }
          ).populate([
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
                    { path: "user" },
                    { path: "comments", populate: [{ path: "user" }] },
                  ],
                },
              ],
            },
            { path: "followers" },
            { path: "likedPosts" },
            { path: "sentFriendRequests" },
            { path: "friendRequests" },
          ]);
          const userId = loggedInUser._id;
          let idToken = jwt.sign(
            { userId: userId.toString() },
            process.env.JWT_SECRET,
            {
              expiresIn: "15m",
            }
          );
          let refreshToken = jwt.sign(
            { userId: userId.toString() },
            process.env.JWT_REFRESH_SECRET,
            {
              expiresIn: "10d",
            }
          );
          res.cookie("idToken", idToken.toString(), {
            sameSite: "lax",
            maxAge: 5 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "DEV" ? false : true,
          });
          res.cookie("refreshToken", refreshToken.toString(), {
            sameSite: "lax",
            maxAge: 10 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "DEV" ? false : true,
          });
          return res.status(200).send({ success: true, user: loggedInUser });
        } catch (error) {
          return res.status(500).send({ success: false, error: error.message });
        }
      } else {
        return res
          .status(401)
          .send({ success: false, error: "Invalid Credentials" });
      }
    }
  }
});

Router.post("/logout", async (req, res) => {
  console.log("LOGOUT ENDPOINT ACCESSED");
  try {
    res.clearCookie("idToken");
    res.clearCookie("refreshToken");
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

Router.post("/register", async (req, res) => {
  if (req.body === null) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request | missing data in request" });
  }
  try {
    const newUser = new User(req.body);
    newUser.save();
    return res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

Router.get("/refresh-token", async (req, res) => {
  const { refreshToken, idToken } = req.cookies;
  if (!idToken) {
    return res.status(401).send({ success: false, error: "Token is missing" });
  } else {
    try {
      const decodedToken = jwt.decode(idToken, process.env.JWT_SECRET);
      let currentDate = new Date();
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log(process.env.JWT_REFRESH_SECRET);
        jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
          (err, user) => {
            if (err) {
              res.status(401).send({ success: false, error: err.message });
            } else {
              const newIdToken = jwt.sign(
                { userId: user.userId },
                process.env.JWT_SECRET,
                { expiresIn: "10d" }
              );
              return res
                .cookie("idToken", newIdToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "DEV" ? false : true,
                  sameSite: "none",
                  maxAge: 5 * 24 * 60 * 60 * 1000,
                })
                .status(200)
                .send({ success: true });
            }
          }
        );
      } else {
        return res.status(200).send({ success: true });
      }
    } catch (error) {
      console.log(error);
      return res.status(403).send({ error: "Invalid Token ", success: false });
    }
  }
});

module.exports = Router;
