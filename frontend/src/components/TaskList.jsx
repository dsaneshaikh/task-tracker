import TaskItem from "./TaskItem";
import { toast } from "react-hot-toast";
import api from "../api";

export default function TaskList({ tasks, setTasks }) {
  const updateTask = async (taskId, updates) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}`, updates);
      setTasks(tasks.map((t) => (t._id === taskId ? data : t)));
      toast.success("Task updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  if (tasks.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No tasks yet. Add one above!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
}
