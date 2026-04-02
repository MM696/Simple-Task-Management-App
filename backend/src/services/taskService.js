const { AppError } = require("../utils/AppError");

async function createTask({ userId, Task, data }) {
  const task = await Task.create({ ...data, userId });
  return task.toObject();
}

async function listTasks({ userId, Task, filter }) {
  const cleanFilter = {};
  if (filter?.status) cleanFilter.status = filter.status;
  if (filter?.priority) cleanFilter.priority = filter.priority;

  const tasks = await Task.find({ userId, ...cleanFilter }).sort({ dueDate: 1, createdAt: -1 });
  return tasks.map((t) => t.toObject());
}

async function updateTask({ userId, Task, id, data, mode }) {
  const filter = { _id: id, userId };

  const update = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (v !== undefined) update[k] = v;
  }

  const updated = await Task.findOneAndUpdate(filter, { $set: update }, { new: true, runValidators: true });

  if (!updated) throw new AppError(404, "Task not found");
  return updated.toObject();
}

async function deleteTask({ userId, Task, id }) {
  const deleted = await Task.findOneAndDelete({ _id: id, userId });
  if (!deleted) throw new AppError(404, "Task not found");
  return { id };
}

module.exports = { createTask, listTasks, updateTask, deleteTask };

