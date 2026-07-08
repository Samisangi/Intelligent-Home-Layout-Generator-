import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await loginUser(form);
      login(data.data.user, data.data.accessToken, data.data.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email" placeholder="Email" className="w-full border rounded p-2"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
        />
        <input
          type="password" placeholder="Password" className="w-full border rounded p-2"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
        />
        <button className="w-full bg-slate-900 text-white rounded p-2">Login</button>
      </form>
    </div>
  );
};

export default Login;