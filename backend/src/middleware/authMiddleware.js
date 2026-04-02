const jwt = require("jsonwebtoken");
const env = require("../config/env");


function authMiddleware(tokenBlacklist) {
  return function (req, res, next) {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid Authorization header" });
      }

      const token = header.slice("Bearer ".length).trim();
      const decoded = jwt.verify(token, env.JWT_SECRET);

      const jti = decoded.jti;
      if (tokenBlacklist?.has(jti)) {
        return res.status(401).json({ message: "Token invalidated. Please log in again." });
      }

      req.user = { id: decoded.sub, jti, exp: decoded.exp };
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

module.exports = { authMiddleware };

