const { connectMongo } = require("./config/mongo");
const env = require("./config/env");
const { TokenBlacklist } = require("./services/tokenBlacklist");
const User = require("./models/User");
const Task = require("./models/Task");
const { createApp } = require("./app");

async function main() {
  await connectMongo(env.DATABASE_URL);

  const tokenBlacklist = new TokenBlacklist();
  const app = createApp({ User, Task, tokenBlacklist });

  app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

