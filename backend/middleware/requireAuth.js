const User = require("../models/User");
const { verifyAuthToken } = require("../lib/auth");

module.exports = async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Sign in to continue." });
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Your session is no longer valid. Please sign in again." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Your session has expired. Please sign in again." });
  }
};
