import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      await login(credentials);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm
        title="Login"
        fields={["email", "password"]}
        onSubmit={handleSubmit}
        error={error}
        buttonText={loading ? "Logging in..." : "Login"}
        disabled={loading}
      />
    </div>
  );
}
