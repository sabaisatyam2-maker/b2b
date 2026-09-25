import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const formRef = useRef();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Yahan aapko apne EmailJS ke credentials daalne honge
      await emailjs.sendForm(
        "service_e4w64an",
        "template_2gwoqdf",
        formRef.current,
        "Hlq3T55CdMZKq7aT6"
      );
      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 24px" }}>
      <div className="card" style={{ maxWidth: 600, margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontSize: 32, marginBottom: 24 }}>Contact Us</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>Have questions or need support? Reach out to us.</p>
        
        {sent ? (
          <div className="alert alert-success" style={{ textAlign: "center", padding: "24px" }}>
            <strong>Message Sent!</strong>
            <p style={{ marginTop: 8 }}>We'll get back to you shortly.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="field">
              <label>Name</label>
              <input 
                name="user_name"
                required 
                placeholder="Your Name" 
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input 
                name="user_email"
                type="email" 
                required 
                placeholder="Your Email" 
              />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea 
                name="message"
                required 
                placeholder="How can we help?" 
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


