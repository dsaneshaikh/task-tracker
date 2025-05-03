import { Link } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ProjectCard({ project, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(project._id)}
          className="text-red-500 hover:text-red-700 transition"
          aria-label="Delete project"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
      <Link
        to={`/projects/${project._id}`}
        className="mt-4 inline-block text-primary hover:text-secondary font-medium transition"
      >
        View Tasks →
      </Link>
    </div>
  );
}
