import React, { useState } from "react";

const priorities = ["low", "medium", "high"];
const statuses = ["todo", "in-progress", "done"];

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState("todo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onCreate({ title, description, dueDate, priority, status });
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("low");
      setStatus("todo");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Create Task</h3>
      {error ? <div className="error">{error}</div> : null}
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
      </label>
      <div style={{ height: 12 }} />
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={2000}
        />
      </label>
      <div style={{ height: 12 }} />
      <label>
        Due Date
        <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" required />
      </label>
      <div style={{ height: 12 }} />
      <div className="row">
        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ height: 12 }} />
      <button disabled={loading} type="submit">
        {loading ? "Creating..." : "Add task"}
      </button>
    </form>
  );
}

