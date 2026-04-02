/* Blacklist the token so it can’t be used anymore. */
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

