const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { createTaskController } = require("../controllers/taskController");

function createTaskRoutes({ Task, tokenBlacklist }) {
  const router = express.Router();
  const controller = createTaskController({ Task });

  router.use(authMiddleware(tokenBlacklist));

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.patch("/:id", controller.patch);
  router.put("/:id", controller.put);
  router.delete("/:id", controller.remove);

  return router;
}

module.exports = { createTaskRoutes };

