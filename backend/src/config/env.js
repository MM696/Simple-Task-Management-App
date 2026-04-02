const path = require("path");
const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16)
});

const env = EnvSchema.safeParse(process.env);

if (!env.success) {
  // Fail fast in development; during tests, users can set env vars explicitly.
  const formatted = env.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
  throw new Error(`Invalid environment variables: ${formatted}`);
}

module.exports = {
  PORT: env.data.PORT,
  DATABASE_URL: env.data.DATABASE_URL,
  JWT_SECRET: env.data.JWT_SECRET
};

