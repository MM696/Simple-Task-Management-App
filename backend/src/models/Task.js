const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], required: true },
    status: { type: String, enum: ["todo", "in-progress", "done"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);

