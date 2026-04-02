/**
 * Lightweight in-memory token blacklist.
 * This is sufficient for an assessment app; it will reset when the server restarts.
 */
class TokenBlacklist {
  constructor() {
    this.jtiToExpMs = new Map(); // jti -> expMs
  }

  add(jti, expMs) {
    if (!jti) return;
    this.jtiToExpMs.set(jti, expMs || Date.now());
  }

  has(jti) {
    if (!jti) return false;
    const expMs = this.jtiToExpMs.get(jti);
    if (!expMs) return false;
    if (Date.now() > expMs) {
      this.jtiToExpMs.delete(jti);
      return false;
    }
    return true;
  }
}

module.exports = { TokenBlacklist };

