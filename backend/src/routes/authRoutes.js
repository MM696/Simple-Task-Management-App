const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { createAuthController } = require("../controllers/authController");

function createAuthRoutes({ User, tokenBlacklist }) {
  const router = express.Router();
  const controller = createAuthController({ User, tokenBlacklist });

  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.post("/logout", authMiddleware(tokenBlacklist), controller.logout);

  return router;
}

module.exports = { createAuthRoutes };

