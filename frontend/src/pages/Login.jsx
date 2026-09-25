import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data, data.token);
      if (data.role === "vendor") navigate("/vendor/dashboard");
      else if (data.role === "admin") navigate("/admin/dashboard");
      else {
        if (location.state?.from) navigate(location.state.from);
        else navigate("/browse");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Welcome back</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={change} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={change} required />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p style={{ marginTop: 14, fontSize: 13.5, textAlign: "center" }}>
          <Link to="/forgot-password" style={{ color: "var(--primary)" }}>Forgot password?</Link>
        </p>
        <p style={{ marginTop: 8, fontSize: 13.5, textAlign: "center", color: "var(--muted)" }}>
          New here? <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

