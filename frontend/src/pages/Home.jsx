import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Task Tracker Pro</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Organize your projects and tasks efficiently with our intuitive tracking
        system.
      </p>
      <div className="space-x-4">
        <Link to="/login" className="btn-primary px-6 py-3">
          Login
        </Link>
        <Link
          to="/signup"
          className="btn-primary px-6 py-3 bg-secondary hover:bg-primary"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
