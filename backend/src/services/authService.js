const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/env");

const TOKEN_TTL_SECONDS = 60 * 60; // 1 hour

async function registerUser({ email, password, User }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already in use");
    err.statusCode = 400;
    throw err;
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({ email, password: hashedPassword });
  return signAccessToken(user);
}

async function loginUser({ email, password, User }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  return signAccessToken(user);
}

function signAccessToken(user) {
  const jti = crypto.randomUUID();
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const token = jwt.sign({ sub: user._id.toString(), jti, exp }, config.JWT_SECRET);

  return {
    token,
    user: { id: user._id.toString(), email: user.email }
  };
}

module.exports = { registerUser, loginUser };

