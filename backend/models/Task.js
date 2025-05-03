const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    dueDate: {
      type: Date,
      // required: true,    // <— uncomment if you want to force a due date
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: false, // you can switch to `true` if you’d rather have Mongoose auto-manage createdAt/updatedAt
  }
);

module.exports = mongoose.model("Task", taskSchema);
