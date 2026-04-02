import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTask, deleteTask, listTasks, updateTask } from "../api/tasksApi";
import { logout } from "../api/authApi";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const filters = useMemo(() => {
    return {
      status: status || undefined,
      priority: priority || undefined
    };
  }, [status, priority]);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await listTasks(filters);
      setTasks(data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load tasks";
      setError(msg);
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-hooks/exhaustive-deps
  }, [filters.status, filters.priority]);

  async function handleCreate(payload) {
    setError("");
    await createTask(payload);
    await loadTasks();
  }

  async function handleStatusChange(id, payload) {
    setError("");
    await updateTask(id, payload);
    await loadTasks();
  }

  async function handleEdit(id, payload) {
    setError("");
    await updateTask(id, payload);
    await loadTasks();
  }

  async function handleDelete(id) {
    setError("");
    await deleteTask(id);
    await loadTasks();
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // If logout fails, remove local token and route away
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ height: 12 }} />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Filters</h3>
        <div className="row">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="todo">todo</option>
              <option value="in-progress">in-progress</option>
              <option value="done">done</option>
            </select>
          </label>
          <label>
            Priority
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">All</option>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <TaskForm onCreate={handleCreate} />

      <div style={{ height: 12 }} />

      {error ? <div className="error" style={{ marginBottom: 12 }}>{error}</div> : null}
      {loading ? (
        <div className="card">Loading tasks...</div>
      ) : (
        <TaskList
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

