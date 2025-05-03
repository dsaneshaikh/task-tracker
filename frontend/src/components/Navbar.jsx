import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow fixed w-full top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-primary">
          TaskTracker
        </Link>

        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <span className="text-gray-700">Hello, {user.name}</span>
              <button
                onClick={logout}
                className="bg-secondary hover:bg-accent text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
