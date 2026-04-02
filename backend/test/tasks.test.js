const { TaskIdParamSchema, PatchTaskBodySchema, CreateTaskBodySchema } = require("../src/validation/taskSchemas");
const { updateTask, deleteTask } = require("../src/services/taskService");
const { AppError } = require("../src/utils/AppError");

test("task schemas validate inputs", () => {
  expect(() => TaskIdParamSchema.parse({ id: "not-an-id" })).toThrow();
  expect(() => PatchTaskBodySchema.parse({})).toThrow();

  expect(() =>
    CreateTaskBodySchema.parse({
      title: "T",
      description: "",
      dueDate: "2026-01-01",
      priority: "low",
      status: "todo"
    })
  ).not.toThrow();
});

test("taskService update enforces ownership filter at query level", async () => {
  const userId = "aaaaaaaaaaaaaaaaaaaaaaaa";
  const id = "bbbbbbbbbbbbbbbbbbbbbbbb";

  const TaskMock = {
    findOneAndUpdate: jest.fn().mockResolvedValue({
      toObject: () => ({ _id: id, userId, status: "done" })
    })
  };

  const updated = await updateTask({
    userId,
    Task: TaskMock,
    id,
    data: { status: "done" },
    mode: "patch"
  });

  expect(TaskMock.findOneAndUpdate).toHaveBeenCalledTimes(1);
  expect(TaskMock.findOneAndUpdate).toHaveBeenCalledWith(
    { _id: id, userId },
    { $set: { status: "done" } },
    { new: true, runValidators: true }
  );
  expect(updated.status).toBe("done");
});

test("taskService throws 404 when ownership query matches nothing", async () => {
  const userId = "aaaaaaaaaaaaaaaaaaaaaaaa";
  const id = "bbbbbbbbbbbbbbbbbbbbbbbb";

  const TaskMock = {
    findOneAndUpdate: jest.fn().mockResolvedValue(null)
  };

  await expect(
    updateTask({
      userId,
      Task: TaskMock,
      id,
      data: { status: "done" },
      mode: "patch"
    })
  ).rejects.toBeInstanceOf(AppError);
});

test("taskService delete enforces ownership filter at query level", async () => {
  const userId = "aaaaaaaaaaaaaaaaaaaaaaaa";
  const id = "bbbbbbbbbbbbbbbbbbbbbbbb";

  const TaskMock = {
    findOneAndDelete: jest.fn().mockResolvedValue({ _id: id })
  };

  await deleteTask({ userId, Task: TaskMock, id });
  expect(TaskMock.findOneAndDelete).toHaveBeenCalledWith({ _id: id, userId });
});

