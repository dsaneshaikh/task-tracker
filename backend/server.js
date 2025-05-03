require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");

const app = express();

// --- MIDDLEWARE & CONFIGURATION ---

// CORS: allow only your frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-tracker-qzlxrvb87-dsaneshaikhs-projects.vercel.app",
    ],
    credentials: true,
  })
);

// Body parsing & cookies
app.use(express.json());
app.use(cookieParser());

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!" });
});

// Global error handler (optional)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong" });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
