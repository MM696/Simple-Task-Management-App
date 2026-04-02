import { api } from "./client";

export async function listTasks({ status, priority } = {}) {
  const params = {};
  if (status) params.status = status;
  if (priority) params.priority = priority;
  const res = await api.get("/api/tasks", { params });
  return res.data.tasks;
}

export async function createTask(payload) {
  const res = await api.post("/api/tasks", payload);
  return res.data;
}

export async function updateTask(id, payload) {
  const res = await api.patch(`/api/tasks/${id}`, payload);
  return res.data;
}

export async function deleteTask(id) {
  const res = await api.delete(`/api/tasks/${id}`);
  return res.data;
}

