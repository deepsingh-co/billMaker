const express = require("express");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");
const { signAuthToken } = require("../lib/auth");
const {
  normalizeName,
  normalizeEmail,
  validateLoginInput,
  validateRegistrationInput,
} = require("../lib/validation");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many sign-in attempts. Please wait a few minutes and try again.",
  },
});

const BCRYPT_ROUNDS = 12;

function firstError(errors) {
  return Object.values(errors)[0] || "Check the details you entered.";
}

// Create an account and return a signed-in session straight away.
router.post("/register", authLimiter, async (req, res) => {
  try {
    const name = normalizeName(req.body?.name);
    const email = normalizeEmail(req.body?.email);
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    const errors = validateRegistrationInput({ name, email, password });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: firstError(errors), errors });
    }

    const existing = await User.exists({ email });
    if (existing) {
      return res.status(409).json({
        error: "An account with this email already exists. Try signing in instead.",
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await User.create({
      name,
      email,
      passwordHash,
      lastLoginAt: new Date(),
    });

    return res.status(201).json({
      token: signAuthToken(user._id, true),
      user: user.toPublicJSON(),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        error: "An account with this email already exists. Try signing in instead.",
      });
    }
    console.error("Registration failed:", error);
    return res.status(500).json({
      error: "We could not create your account. Please try again.",
    });
  }
});

// Exchange email and password for a JWT session.
router.post("/login", authLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";
    const remember = Boolean(req.body?.remember);

    const errors = validateLoginInput({ email, password });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: firstError(errors), errors });
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }

    const now = new Date();
    await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: now } });
    user.lastLoginAt = now;

    return res.json({
      token: signAuthToken(user._id, remember),
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({
      error: "We could not sign you in right now. Please try again.",
    });
  }
});

// Return the signed-in account so the client can restore a session on reload.
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

module.exports = router;
