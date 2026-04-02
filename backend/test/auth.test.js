const { TokenBlacklist } = require("../src/services/tokenBlacklist");
const { RegisterSchema, LoginSchema } = require("../src/validation/authSchemas");

test("token blacklist invalidates tokens (exp respected)", async () => {
  const blacklist = new TokenBlacklist();
  const jti = "jti-1";

  // Expire quickly for test determinism.
  blacklist.add(jti, Date.now() + 50);
  expect(blacklist.has(jti)).toBe(true);

  await new Promise((r) => setTimeout(r, 75));
  expect(blacklist.has(jti)).toBe(false);
});

test("auth schemas validate inputs", () => {
  expect(() => RegisterSchema.parse({ email: "not-an-email", password: "password123" })).toThrow();
  expect(() => RegisterSchema.parse({ email: "a@example.com", password: "short" })).toThrow();

  expect(() =>
    LoginSchema.parse({ email: "a@example.com", password: "password123" })
  ).not.toThrow();
});

