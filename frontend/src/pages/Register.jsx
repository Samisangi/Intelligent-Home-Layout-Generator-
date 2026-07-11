import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data.data.user, data.data.accessToken, data.data.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Create Account</h1>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text" placeholder="Full Name" className="w-full border rounded p-2"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
        />
        <input
          type="email" placeholder="Email" className="w-full border rounded p-2"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
        />
        <input
          type="password" placeholder="Password (min 6 chars)" className="w-full border rounded p-2"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}
        />
        <button disabled={loading} className="w-full bg-slate-900 text-white rounded p-2 disabled:opacity-50">
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-center mt-3">
        Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  );
};

export default Register;