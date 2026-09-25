import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "user" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setSuccess(data.message || "Account created. Check your email to verify, then log in.");
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 style={{ fontSize: 22, marginBottom: 4 }}>Create your account</h2>
        <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>Join as a buyer or list your business.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={change} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={change} required />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={change} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={change} required minLength={6} />
          </div>
          <div className="field">
            <label>I am a...</label>
            <select name="role" value={form.role} onChange={change}>
              <option value="user">Buyer — looking for services</option>
              <option value="vendor">Vendor — offering services</option>
            </select>
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 13.5, textAlign: "center", color: "var(--muted)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
