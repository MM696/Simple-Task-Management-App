import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../api/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await register({ email, password });
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={onSubmit} className="card">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <div style={{ height: 12 }} />
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={8}
          />
        </label>
        {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}
        <div style={{ height: 12 }} />
        <button disabled={loading} type="submit">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

