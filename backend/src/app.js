const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { createAuthRoutes } = require("./routes/authRoutes");
const { createTaskRoutes } = require("./routes/taskRoutes");
const { errorMiddleware } = require("./middleware/errorMiddleware");

function createApp({ User, Task, tokenBlacklist }) {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.status(200).json({ ok: true }));

  app.use("/api/auth", createAuthRoutes({ User, tokenBlacklist }));
  app.use("/api/tasks", createTaskRoutes({ Task, tokenBlacklist }));

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };

