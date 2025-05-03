import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await signup(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AuthForm
        title="Create Account"
        fields={["name", "email", "password", "country"]}
        onSubmit={handleSubmit}
        error={error}
        buttonText={loading ? "Creating Account..." : "Sign Up"}
        disabled={loading}
        showLoginLink={true}
      />
    </div>
  );
}
