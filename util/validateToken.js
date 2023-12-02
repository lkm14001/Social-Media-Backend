const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  const idToken = req.cookies.idToken;
  if (idToken) {
    try {
      jwt.verify(idToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).send({ success: false, error: err.message });
        }
        console.log("TOKEN_VERIFICATION_SUCCESSFUL");
        console.log('TOKEN VERIFIED USER',user)
        req.userId = user.userId;
      });
      next();
    } catch (error) {
      console.log("TOKEN_VERIFICATION_FAILED");
      res.clearCookie("idToken", {
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "DEV" ? false : true,
      });
      return res.status(401).send({ success: false, error: error.message });
    }
  } else {
    return res.status(500).send({ success: false, error: "Token Not Found" });
  }
};

module.exports = validateToken;
