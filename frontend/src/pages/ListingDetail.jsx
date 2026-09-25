import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get(/listings/ + id)
      .then((res) => setListing(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setError(""); setSending(true);
    try {
      await api.post(/enquiries/ + id, form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send enquiry");
    } finally {
      setSending(false);
    }
  };

  if (notFound) {
    return (
      <div className="container empty-state" style={{ padding: "100px 24px" }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Listing Not Found</h2>
        <p style={{ color: "var(--muted)", maxWidth: 400, margin: "0 auto" }}>This listing isn't available � it may be pending approval or was removed.</p>
        <Link to="/browse" className="btn btn-outline" style={{ marginTop: 24 }}>Back to browse</Link>
      </div>
    );
  }
  if (!listing) return <div className="container" style={{ padding: 100, textAlign: "center" }}>Loading...</div>;

  return (
    <>
      <div className="listing-header">
        <div className="container">
          <div className="listing-header-content">
            <span className="badge badge-approved" style={{ marginBottom: 16 }}>{listing.category}</span>
            <h1 className="listing-title">{listing.businessName}</h1>
            <p className="listing-location">Location: {listing.location}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px 80px" }}>
        <div className="listing-layout">
          
          <div className="listing-main">
            {listing.images?.length > 0 && (
              <div style={{ position: "relative", marginBottom: 32 }}>
                <img src={listing.images[currentImageIndex].url} alt="Listing Image" style={{ width: "100%", height: 400, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }} />
                
                {listing.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? listing.images.length - 1 : prev - 1)}
                      style={{ position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "background 0.2s" }}
                    >{'<'}</button>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => prev === listing.images.length - 1 ? 0 : prev + 1)}
                      style={{ position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "background 0.2s" }}
                    >{'>'}</button>
                    
                    <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
                      {listing.images.map((_, idx) => (
                        <div key={idx} style={{ width: 8, height: 8, borderRadius: "50%", background: idx === currentImageIndex ? "white" : "rgba(255,255,255,0.5)", transition: "background 0.3s" }} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="card listing-section">
              <h3>About the Business</h3>
              <p className="listing-desc">{listing.description}</p>
            </div>

            {user && (
              <div className="card listing-section contact-card">
                <h3>Contact Information</h3>
                <div className="contact-grid">
                  <div className="contact-item">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">{listing.contactEmail}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">{listing.contactPhone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="listing-sidebar">
            <div className="card sticky-card">
                {listing.price && (
                  <div style={{ paddingBottom: 16, borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
                    <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>Service Charges</p>
                    <h2 style={{ margin: 0, fontSize: 28, color: "var(--primary)" }}>₹ {listing.price}</h2>
                  </div>
                )}
                <h3 style={{ marginBottom: 20 }}>Send an Enquiry</h3>
              
              {!user ? (
                <div className="auth-prompt">
                  
                  <p>Log in to contact this vendor directly and securely.</p>
                  <Link to="/login" state={{ from: `/listing/${id}` }} className="btn btn-primary btn-block">Log in</Link>
                </div>
              ) : sent ? (
                <div className="alert alert-success" style={{ textAlign: "center", padding: "24px 16px" }}>
                  
                  <strong>Enquiry sent successfully!</strong>
                  <p style={{ marginTop: 8, fontSize: 13, color: "var(--success)" }}>The vendor has been notified and will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={submitEnquiry} className="enquiry-form">
                  {error && <div className="alert alert-error">{error}</div>}
                  <div className="field">
                    <label>Your Name</label>
                    <input 
                      placeholder="e.g. John Doe"
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="field">
                    <label>Contact Info</label>
                    <input 
                      placeholder="Phone or Email"
                      value={form.contact} 
                      onChange={(e) => setForm({ ...form, contact: e.target.value })} 
                      required 
                    />
                      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>* Please provide correct contact details so the service provider can reach out to you easily.</p>
                  </div>
                  <div className="field">
                    <label>Message</label>
                    <textarea 
                      placeholder="Hi, I'm interested in your services..."
                      value={form.message} 
                      onChange={(e) => setForm({ ...form, message: e.target.value })} 
                      required 
                    />
                  </div>
                  <button className="btn btn-primary btn-block" disabled={sending} style={{ marginTop: 12 }}>
                    {sending ? "Sending..." : "Send Enquiry "}
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
















