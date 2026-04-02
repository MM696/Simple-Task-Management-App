import { api } from "./client";

export async function register({ email, password }) {
  const res = await api.post("/api/auth/register", { email, password });
  return res.data; 
}

export async function login({ email, password }) {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data; 
}

export async function logout() {
  await api.post("/api/auth/logout");
}

