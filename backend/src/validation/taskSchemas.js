const { z } = require("zod");

const PriorityEnum = z.enum(["low", "medium", "high"]);
const StatusEnum = z.enum(["todo", "in-progress", "done"]);

const DueDateSchema = z.preprocess((val) => {
  if (val === null || val === undefined || val === "") return undefined;
  // Accept ISO strings from JSON.
  if (typeof val === "string" || val instanceof Date) return new Date(val);
  return val;
}, z.date());

const TaskIdParamSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/)
});

const CreateTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().default(""),
  dueDate: DueDateSchema,
  priority: PriorityEnum,
  status: StatusEnum.default("todo").optional()
});

// PATCH supports partial updates; at least one field must be present.
const PatchTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    dueDate: DueDateSchema.optional(),
    priority: PriorityEnum.optional(),
    status: StatusEnum.optional()
  })
  .refine((obj) => Object.keys(obj).length > 0, { message: "At least one field is required" });

// PUT requires a complete task payload.
const PutTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(""),
  dueDate: DueDateSchema,
  priority: PriorityEnum,
  status: StatusEnum
});

const ListTasksQuerySchema = z.object({
  status: StatusEnum.optional(),
  priority: PriorityEnum.optional()
});

module.exports = {
  PriorityEnum,
  StatusEnum,
  TaskIdParamSchema,
  CreateTaskBodySchema,
  PatchTaskBodySchema,
  PutTaskBodySchema,
  ListTasksQuerySchema
};

