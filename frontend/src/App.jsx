import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ProjectTasks from "./pages/ProjectTasks";
import { useEffect } from "react";
import api from "./api";

export default function App() {
  useEffect(() => {
    api
      .get("/test")
      .then(({ data }) => {
        console.log("Backend response:", data.message);
      })
      .catch((err) => {
        console.error("Connection failed:", err);
      });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectTasks />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
