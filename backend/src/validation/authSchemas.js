const { z } = require("zod");

const RegisterSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(128)
});

const LoginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(128)
});

module.exports = { RegisterSchema, LoginSchema };

