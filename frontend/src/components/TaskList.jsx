import React, { useState } from "react";

const statuses = ["todo", "in-progress", "done"];
const priorities = ["low", "medium", "high"];

export default function TaskList({ tasks, onStatusChange, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "todo"
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  function startEdit(task) {
    setEditError("");
    setEditingId(task._id);
    setForm({
      title: task.title || "",
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
      priority: task.priority || "low",
      status: task.status || "todo"
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
  }

  async function saveEdit(id) {
    setSaving(true);
    setEditError("");
    try {
      await onEdit(id, form);
      setEditingId(null);
    } catch (err) {
      setEditError(err?.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  }

  if (!tasks.length) {
    return <div className="card">No tasks yet.</div>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="card">
          {editingId === task._id ? (
            <div>
              <h4 style={{ margin: "0 0 8px 0" }}>Edit Task</h4>
              {editError ? <div className="error" style={{ marginBottom: 8 }}>{editError}</div> : null}
              <label>
                Title
                <input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  maxLength={200}
                />
              </label>
              <div style={{ height: 8 }} />
              <label>
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  maxLength={2000}
                />
              </label>
              <div style={{ height: 8 }} />
              <div className="row">
                <label>
                  Due Date
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                </label>
                <label>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div style={{ height: 12 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button disabled={saving} onClick={() => saveEdit(task._id)}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button disabled={saving} onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 8px 0" }}>{task.title}</h4>
              {task.description ? <p style={{ margin: "0 0 8px 0" }}>{task.description}</p> : null}
              <div style={{ fontSize: 13, color: "#555" }}>
                Priority: {task.priority} <br />
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
              </div>
            </div>
            <div style={{ width: 260 }}>
              <label>
                Status
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task._id, { status: e.target.value })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <div style={{ height: 12 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => onDelete(task._id)}>Delete</button>
              </div>
            </div>
          </div>
          )}
        </div>
      ))}
    </div>
  );
}

