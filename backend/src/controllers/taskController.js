const { createTask, listTasks, updateTask, deleteTask } = require("../services/taskService");

function createTaskController({ Task }) {
  async function create(req, res, next) {
    try {
      const { CreateTaskBodySchema } = require("../validation/taskSchemas");
      const body = CreateTaskBodySchema.parse(req.body);
      const task = await createTask({ userId: req.user.id, Task, data: body });
      return res.status(201).json(task);
    } catch (err) {
      return next(err);
    }
  }

  async function list(req, res, next) {
    try {
      const { ListTasksQuerySchema } = require("../validation/taskSchemas");
      const query = ListTasksQuerySchema.parse(req.query);
      const tasks = await listTasks({ userId: req.user.id, Task, filter: query });
      return res.status(200).json({ tasks });
    } catch (err) {
      return next(err);
    }
  }

  async function patch(req, res, next) {
    try {
      const { TaskIdParamSchema, PatchTaskBodySchema } = require("../validation/taskSchemas");
      const params = TaskIdParamSchema.parse(req.params);
      const body = PatchTaskBodySchema.parse(req.body);
      const updated = await updateTask({
        userId: req.user.id,
        Task,
        id: params.id,
        data: body,
        mode: "patch"
      });
      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  }

  async function put(req, res, next) {
    try {
      const { TaskIdParamSchema, PutTaskBodySchema } = require("../validation/taskSchemas");
      const params = TaskIdParamSchema.parse(req.params);
      const body = PutTaskBodySchema.parse(req.body);
      const updated = await updateTask({
        userId: req.user.id,
        Task,
        id: params.id,
        data: body,
        mode: "put"
      });
      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  }

  async function remove(req, res, next) {
    try {
      const { TaskIdParamSchema } = require("../validation/taskSchemas");
      const params = TaskIdParamSchema.parse(req.params);
      await deleteTask({ userId: req.user.id, Task, id: params.id });
      return res.status(200).json({ message: "Task deleted" });
    } catch (err) {
      return next(err);
    }
  }

  return { create, list, patch, put, remove };
}

module.exports = { createTaskController };

