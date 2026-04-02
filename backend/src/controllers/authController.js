const { registerUser, loginUser } = require("../services/authService");

function createAuthController({ User, tokenBlacklist }) {
  async function register(req, res, next) {
    try {
      const { RegisterSchema } = require("../validation/authSchemas");
      const body = RegisterSchema.parse(req.body);
      const result = await registerUser({ ...body, User });
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async function login(req, res, next) {
    try {
      const { LoginSchema } = require("../validation/authSchemas");
      const body = LoginSchema.parse(req.body);
      const result = await loginUser({ ...body, User });
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async function logout(req, res, next) {
    try {
      // authMiddleware verified the JWT already and attached jti/exp.
      tokenBlacklist.add(req.user.jti, req.user.exp * 1000);
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }

  return { register, login, logout };
}

module.exports = { createAuthController };

