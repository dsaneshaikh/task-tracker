const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const Project = require("../models/Project");

// Create a new task
router.post("/", auth, async (req, res) => {
  try {
    const title = (req.body.title || "").trim();
    if (!title) {
      return res
        .status(400)
        .json({ error: "Task title is required", code: "MISSING_TITLE" });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: req.body.project,
      user: req.user._id,
    });
    if (!project) {
      return res
        .status(404)
        .json({ error: "Project not found", code: "PROJECT_NOT_FOUND" });
    }

    // Parse optional dueDate
    const dueDate = req.body.dueDate ? new Date(req.body.dueDate) : undefined;

    const task = new Task({
      title,
      description: (req.body.description || "").trim(),
      status: "Todo",
      dueDate,
      project: project._id,
    });
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    console.error("TASK_CREATION_FAILED:", err);
    res
      .status(400)
      .json({
        error: err.message || "Failed to create task",
        code: "TASK_CREATION_FAILED",
      });
  }
});

// Get tasks for a project
router.get("/:projectId", auth, async (req, res) => {
  try {
    // Verify project ownership
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id,
    });
    if (!project) {
      return res
        .status(404)
        .json({ error: "Project not found", code: "PROJECT_NOT_FOUND" });
    }

    const tasks = await Task.find({ project: project._id })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("TASK_FETCH_FAILED:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve tasks", code: "TASK_FETCH_FAILED" });
  }
});

// Update a task
router.patch("/:taskId", auth, async (req, res) => {
  try {
    const allowed = ["title", "description", "status", "dueDate"];
    const updates = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "status") {
          updates.status = req.body.status;
        } else if (field === "dueDate") {
          // allow clearing dueDate by sending empty string or null
          updates.dueDate = req.body.dueDate
            ? new Date(req.body.dueDate)
            : null;
        } else {
          updates[field] = req.body[field].trim();
        }
      }
    });

    if (updates.status === "Done") {
      updates.completedAt = Date.now();
    }

    // Find and update, ensuring the task’s project belongs to this user
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId },
      updates,
      { new: true, runValidators: true }
    ).populate({
      path: "project",
      match: { user: req.user._id },
    });

    if (!task || !task.project) {
      return res
        .status(404)
        .json({ error: "Task not found", code: "TASK_NOT_FOUND" });
    }

    res.json(task);
  } catch (err) {
    console.error("TASK_UPDATE_FAILED:", err);
    res
      .status(400)
      .json({
        error: err.message || "Failed to update task",
        code: "TASK_UPDATE_FAILED",
      });
  }
});

// Delete a task
router.delete("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
    }).populate({
      path: "project",
      match: { user: req.user._id },
    });

    if (!task || !task.project) {
      return res
        .status(404)
        .json({ error: "Task not found", code: "TASK_NOT_FOUND" });
    }

    res.json({ message: "Task deleted", deletedTaskId: task._id });
  } catch (err) {
    console.error("TASK_DELETION_FAILED:", err);
    res
      .status(500)
      .json({ error: "Failed to delete task", code: "TASK_DELETION_FAILED" });
  }
});

module.exports = router;
