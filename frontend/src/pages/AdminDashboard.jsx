import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { gsap } from "../gsapSetup";

export default function AdminDashboard() {
  const [tab, setTab] = useState("pending");
  const [pending, setPending] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPending = () => api.get("/admin/requests/pending").then((res) => setPending(res.data));
  const loadVendors = () => api.get("/admin/vendors").then((res) => setVendors(res.data));
  const loadCategories = () => api.get("/admin/categories").then((res) => setCategories(res.data));

  useEffect(() => {
    setLoading(true);
    Promise.all([loadPending(), loadVendors(), loadCategories()]).finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    await api.put(`/admin/requests/${id}/approve`);
    loadPending();
    loadVendors(); // it just became live, so refresh this list too
  };

  const reject = async (id) => {
    const reason = prompt("Reason for rejection (optional):") || "";
    await api.put(`/admin/requests/${id}/reject`, { reason });
    loadPending();
  };

  const removeVendor = async (id) => {
    if (!confirm("Remove this vendor's listing? This can't be undone.")) return;
    await api.delete(`/admin/listing/${id}`);
    loadVendors();
  };

  const listRef = useRef(null);
  useEffect(() => {
    if (loading || !listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".card", { opacity: 0, y: 14, duration: 0.4, stagger: 0.06, ease: "power2.out" });
    }, listRef);
    return () => ctx.revert();
  }, [loading, tab, pending, vendors]);

  return (
    <div className="container" style={{ padding: "36px 24px 64px" }}>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Admin dashboard</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>Review vendor requests, manage live listings, and categories.</p>

      <div className="tab-row">
        <button className={`tab-btn ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
          Pending requests {pending.length > 0 && `(${pending.length})`}
        </button>
        <button className={`tab-btn ${tab === "vendors" ? "active" : ""}`} onClick={() => setTab("vendors")}>
          Live Vendors {vendors.length > 0 && `(${vendors.length})`}
        </button>
        <button className={`tab-btn ${tab === "categories" ? "active" : ""}`} onClick={() => setTab("categories")}>Categories</button>
      </div>

      {tab === "pending" && (
        <div ref={listRef}>
          {!loading && pending.length === 0 && (
            <div className="empty-state"><p>No pending requests right now.</p></div>
          )}
          {pending.map((r) => (
            <div key={r._id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h4 style={{ fontSize: 15.5, marginBottom: 4 }}>{r.businessName}</h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
                    {r.category} · {r.location}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>
                    Vendor: {r.vendor?.name} ({r.vendor?.email}) | Phone: {r.contactPhone}
                  </p>
                  <p style={{ fontSize: 13.5, marginTop: 8, maxWidth: 480 }}>{r.description}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => approve(r._id)}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => reject(r._id)}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "vendors" && (
        <div ref={listRef}>
          {!loading && vendors.length === 0 && (
            <div className="empty-state"><p>No live vendors yet — approve a pending request to see it here.</p></div>
          )}
          {vendors.map((v) => (
            <div key={v._id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                    <h4 style={{ fontSize: 15.5 }}>{v.businessName}</h4>
                    <span className="badge badge-approved">live</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
                    {v.category} · {v.location}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>
                    Vendor: {v.vendor?.name} ({v.vendor?.email}) | Phone: {v.contactPhone}
                  </p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => removeVendor(v._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "categories" && <CategoryManager categories={categories} reload={loadCategories} />}
    </div>
  );
}

function CategoryManager({ categories, reload }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const add = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/categories", { name });
      setName("");
      reload();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add category");
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this category?")) return;
    await api.delete(`/admin/categories/${id}`);
    reload();
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <form onSubmit={add} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          placeholder="New category name, e.g. Blockchain Development"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, padding: "10px 13px", border: "1px solid var(--border)", borderRadius: 6 }}
          required
        />
        <button className="btn btn-primary btn-sm">Add</button>
      </form>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ padding: 0 }}>
        {categories.map((c) => (
          <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 14 }}>{c.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => remove(c._id)} style={{ color: "var(--danger)" }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
