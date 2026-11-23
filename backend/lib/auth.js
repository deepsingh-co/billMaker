const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "barcode-suite-dev-secret-change-before-production";
const SESSION_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const REMEMBER_EXPIRES_IN = process.env.JWT_REMEMBER_EXPIRES_IN || "30d";

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET must be set in production. Add it to backend/.env before starting the API."
  );
}

function signAuthToken(userId, remember = false) {
  return jwt.sign({ sub: String(userId) }, JWT_SECRET, {
    expiresIn: remember ? REMEMBER_EXPIRES_IN : SESSION_EXPIRES_IN,
  });
}

function verifyAuthToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signAuthToken, verifyAuthToken };
