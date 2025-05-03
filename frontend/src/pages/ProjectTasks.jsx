import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskList from "../components/TaskList";
import { toast } from "react-hot-toast";
import api from "../api";

export default function ProjectTasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/tasks/${projectId}`);
        setTasks(data);
      } catch {
        toast.error("Failed to load tasks");
      }
    })();
  }, [projectId]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setCreating(true);
    try {
      const payload = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        dueDate: newTask.dueDate, // ISO date string or empty
        project: projectId,
      };
      const { data } = await api.post("/tasks", payload);
      setTasks([data, ...tasks]);
      setNewTask({ title: "", description: "", dueDate: "" });
      toast.success("Task created!");
    } catch {
      toast.error("Task creation failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Tasks</h2>
        <form onSubmit={createTask} className="space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
            className="w-full p-2 border rounded-md"
            required
            disabled={creating}
          />
          <textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Task description"
            className="w-full p-2 border rounded-md h-24"
            disabled={creating}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              disabled={creating}
            />
          </div>
          <button
            type="submit"
            disabled={creating || !newTask.title.trim()}
            className="btn-primary px-4 py-2 rounded-md disabled:opacity-50"
          >
            {creating ? "Adding…" : "Add Task"}
          </button>
        </form>
      </div>

      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}
