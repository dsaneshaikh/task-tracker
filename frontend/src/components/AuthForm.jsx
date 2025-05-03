import { Link } from "react-router-dom";

export default function AuthForm({
  title,
  fields,
  onSubmit,
  error,
  buttonText,
  showLoginLink = false,
  disabled = false,
}) {
  const icons = {
    email: "✉️",
    password: "🔒",
    name: "👤",
    country: "🌐",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    onSubmit(data);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {title}
      </h2>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field} className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icons[field.toLowerCase()] || "❔"}
            </span>
            {field === "country" ? (
              <select
                name={field}
                disabled={disabled}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-secondary transition"
                required
              >
                <option value="">Select Country</option>
                <option>USA</option>
                <option>UK</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Germany</option>
              </select>
            ) : (
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                disabled={disabled}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-secondary transition"
                required
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={disabled}
          className="w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-accent transition disabled:opacity-50"
        >
          {buttonText || title}
        </button>
      </form>
      {showLoginLink && (
        <p className="mt-4 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-secondary">
            Login
          </Link>
        </p>
      )}
      {!showLoginLink && (
        <p className="mt-4 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:text-secondary">
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
}
