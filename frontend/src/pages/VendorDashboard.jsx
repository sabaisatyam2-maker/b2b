import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { gsap } from "../gsapSetup";

const CATEGORY_FALLBACK = []; // populated from backend at runtime

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function VendorDashboard() {
  const [tab, setTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [categories, setCategories] = useState(CATEGORY_FALLBACK);
  const [loading, setLoading] = useState(true);

  const loadListings = () => api.get("/vendor/my-listings").then((res) => setListings(res.data));
  const loadEnquiries = () => api.get("/vendor/enquiries").then((res) => setEnquiries(res.data));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadListings(),
      loadEnquiries(),
      api.get("/listings/categories").then((res) => setCategories(res.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const deleteListing = async (id) => {
    if (!confirm("Delete this listing?")) return;
    await api.delete(`/vendor/listing/${id}`);
    loadListings();
  };

  const pendingCount = listings.filter((l) => l.status === "pending").length;
  const approvedCount = listings.filter((l) => l.status === "approved").length;
  const statsRef = useRef(null);

  // Count the stat numbers up from 0, and fade the cards in, once data has loaded
  useEffect(() => {
    if (loading || !statsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".stat-card", { opacity: 0, y: 14, duration: 0.4, stagger: 0.08, ease: "power2.out" });
      document.querySelectorAll(".stat-num").forEach((el) => {
        const target = Number(el.textContent);
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target, duration: 0.7, ease: "power1.out",
          onUpdate: () => { el.textContent = Math.round(counter.val); },
        });
      });
    }, statsRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <div className="container" style={{ padding: "36px 24px 64px" }}>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Vendor dashboard</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>Manage your listings and enquiries.</p>

      <div className="stat-cards" ref={statsRef}>
        <div className="card stat-card">
          <div className="stat-num">{listings.length}</div>
          <div className="stat-label">Total listings</div>
        </div>
        <div className="card stat-card">
          <div className="stat-num">{pendingCount}</div>
          <div className="stat-label">Pending approval</div>
        </div>
        <div className="card stat-card">
          <div className="stat-num">{enquiries.length}</div>
          <div className="stat-label">Enquiries received</div>
        </div>
      </div>

      <div className="tab-row">
        <button className={`tab-btn ${tab === "listings" ? "active" : ""}`} onClick={() => setTab("listings")}>My Listings</button>
        <button className={`tab-btn ${tab === "create" ? "active" : ""}`} onClick={() => setTab("create")}>+ New Listing</button>
        <button className={`tab-btn ${tab === "enquiries" ? "active" : ""}`} onClick={() => setTab("enquiries")}>Enquiries</button>
      </div>

      {tab === "listings" && (
        <div>
          {listings.length === 0 && !loading && (
            <div className="empty-state">
              <p>No listings yet. Create your first one to start getting enquiries.</p>
            </div>
          )}
          {listings.map((l) => (
            <div key={l._id} className="card" style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                  <h4 style={{ fontSize: 15.5 }}>{l.businessName}</h4>
                  <StatusBadge status={l.status} />
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>{l.category} · {l.location}</p>
                {l.status === "rejected" && l.rejectionReason && (
                  <p style={{ fontSize: 12.5, color: "var(--danger)", marginTop: 4 }}>Reason: {l.rejectionReason}</p>
                )}
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => deleteListing(l._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === "create" && <CreateListingForm categories={categories} onCreated={() => { loadListings(); setTab("listings"); }} />}

      {tab === "enquiries" && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Listing</th><th>From</th><th>Contact</th><th>Message</th><th>Received</th></tr>
              </thead>
              <tbody>
                {enquiries.slice().sort((a, b) => sortOrder === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)).map((e) => (
                  <tr key={e._id}>
                    <td>{e.vendorRequest?.businessName || "—"}</td>
                    <td>{e.name}</td>
                    <td>{e.contact}</td>
                    <td style={{ maxWidth: 300, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{e.message}</td>
                    <td>{new Date(e.createdAt).toLocaleDateString()} {new Date(e.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {enquiries.length === 0 && <div className="empty-state">No enquiries yet.</div>}
        </div>
      )}
    </div>
  );
}

function CreateListingForm({ categories, onCreated }) {
  const [form, setForm] = useState({
    businessName: "", category: "", description: "", location: "",
    contactEmail: "", contactPhone: "", price: "",
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 5) {
      alert("You can only upload up to 5 files at once.");
      e.target.value = "";
      setFiles([]);
      return;
    }
    const oversized = selected.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      alert("Each file must be less than 5MB. Please choose smaller files.");
      e.target.value = "";
      setFiles([]);
      return;
    }
    setFiles(selected);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("images", f));
      await api.post("/vendor/listing", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label>Business name</label>
          <input name="businessName" value={form.businessName} onChange={change} required />
        </div>
        <div className="field">
          <label>Category</label>
          <select name="category" value={form.category} onChange={change} required>
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={change} required />
        </div>
        <div className="field">
          <label>Location</label>
          <input name="location" value={form.location} onChange={change} required />
        </div>
        <div className="field">
          <label>Contact email</label>
          <input type="email" name="contactEmail" value={form.contactEmail} onChange={change} required />
        </div>
        <div className="field">
          <label>Contact phone</label>
          <input name="contactPhone" value={form.contactPhone} onChange={change} required />
        </div>
        <div className="field">
          <label>Service Charges (?)</label>
          <input type="number" name="price" value={form.price} onChange={change} placeholder="e.g. 500" required />
        </div>
        <div className="field">
          <label>Photos (up to 5)</label>
          <input type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} />
          <p className="field-hint">Hold Ctrl to select multiple files (Max 5 files, Max 5MB each). Your listing goes live only after admin approval.</p>
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Submitting…" : "Submit for approval"}
        </button>
      </form>
    </div>
  );
}






