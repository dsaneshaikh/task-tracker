// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import api from "../api";
import ProjectCard from "../components/ProjectCard";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New-project form state
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Create a new project
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const { data } = await api.post("/projects", { name: newName.trim() });
      setProjects([data, ...projects]);
      setNewName("");
      toast.success("Project created!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Creation failed");
    } finally {
      setCreating(false);
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
      toast.success("Project deleted");
    } catch {
      toast.error("Deletion failed");
    }
  };

  if (loading)
    return <div className="text-center p-8">Loading projects...</div>;
  if (error) return <div className="text-red-600 p-8">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 pt-20">
      {" "}
      {/* pt-20 to offset navbar */}
      <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
      {/* Create-project form */}
      <form
        onSubmit={handleCreate}
        className="flex items-center mb-6 space-x-2"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New project name"
          className="flex-1 p-2 border rounded-md"
          required
        />
        <button
          type="submit"
          disabled={!newName.trim() || creating}
          className="btn-primary px-4 py-2 rounded-md disabled:opacity-50"
        >
          {creating ? "Adding…" : "+ Add Project"}
        </button>
      </form>
      {projects.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">
            No projects found. Create your first project!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
