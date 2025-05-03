import { useState } from "react";
import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
  });

  const statusOptions = ["Todo", "In Progress", "Done"];

  const save = () => {
    onUpdate(task._id, {
      title: edited.title.trim(),
      description: edited.description.trim(),
      status: edited.status,
      dueDate: edited.dueDate,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary">
      <div className="flex items-start justify-between">
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={edited.title}
              onChange={(e) => setEdited({ ...edited, title: e.target.value })}
              className="w-full p-1 border-b"
            />
            <textarea
              value={edited.description}
              onChange={(e) =>
                setEdited({ ...edited, description: e.target.value })
              }
              className="w-full p-1 border-b"
            />
            <select
              value={edited.status}
              onChange={(e) => setEdited({ ...edited, status: e.target.value })}
              className="p-1 border rounded"
            >
              {statusOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={edited.dueDate}
              onChange={(e) =>
                setEdited({ ...edited, dueDate: e.target.value })
              }
              className="p-1 border rounded"
            />
          </div>
        ) : (
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{task.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            {task.dueDate && (
              <p className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-1 rounded-full text-sm 
                  ${
                    task.status === "Done"
                      ? "bg-green-100 text-green-800"
                      : task.status === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
              >
                {task.status}
              </span>
              {task.completedAt && (
                <span className="text-xs text-gray-500">
                  Completed: {new Date(task.completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 ml-4">
          {isEditing ? (
            <button
              onClick={save}
              aria-label="Save"
              className="text-green-600 hover:text-green-800"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              aria-label="Edit"
              className="text-gray-600 hover:text-primary"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => onDelete(task._id)}
            aria-label="Delete"
            className="text-red-600 hover:text-red-800"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
