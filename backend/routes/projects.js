const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");

// Create project (max 4 per user)
router.post("/", auth, async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    if (!name) {
      return res.status(400).json({ error: "Valid project name required" });
    }

    const count = await Project.countDocuments({ user: req.user._id });
    if (count >= 4) {
      return res.status(400).json({
        error: "Project limit reached (max 4 projects)",
        code: "PROJECT_LIMIT_REACHED",
      });
    }

    const project = new Project({ name, user: req.user._id });
    await project.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { projects: project._id },
    });

    res.status(201).json({
      _id: project._id,
      name: project.name,
      createdAt: project.createdAt,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message || "Failed to create project",
      code: "PROJECT_CREATION_FAILED",
    });
  }
});

// Get all projects with task counts
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.aggregate([
      { $match: { user: req.user._id } },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "project",
          as: "tasks",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          createdAt: 1,
          taskCount: { $size: "$tasks" },
          completedTasks: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "t",
                cond: { $eq: ["$$t.status", "Done"] },
              },
            },
          },
        },
      },
    ]);

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to retrieve projects",
      code: "PROJECT_FETCH_FAILED",
    });
  }
});

// Delete project & its tasks
router.delete("/:projectId", auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
        code: "PROJECT_NOT_FOUND",
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { projects: project._id },
    });

    await Task.deleteMany({ project: project._id });

    res.json({
      message: "Project and associated tasks deleted",
      deletedCount: 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete project",
      code: "PROJECT_DELETION_FAILED",
    });
  }
});

module.exports = router;
