const { ZodError } = require("zod");
const { AppError } = require("../utils/AppError");

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  // Zod validation error -> 400
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid request",
      issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message }))
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  if (err && typeof err.statusCode === "number") {
    return res.status(err.statusCode).json({
      message: err.message || "Request failed"
    });
  }

  // Unknown/unexpected error -> 500 (avoid leaking internals)
  console.error(err);
  return res.status(500).json({
    message: "Internal server error"
  });
}

module.exports = { errorMiddleware };

