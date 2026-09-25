export default function About() {
  return (
    <div className="container" style={{ padding: "60px 24px" }}>
      <div className="card" style={{ maxWidth: 800, margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontSize: 32, marginBottom: 24 }}>About BizSphere</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>Empowering B2B connections in the tech industry.</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>Our Mission</h3>
        <p style={{ marginBottom: 16 }}>BizSphere is designed to be the premier marketplace where businesses can seamlessly find verified tech and IT service providers, and vendors can discover real buyers.</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>What We Offer</h3>
        <p style={{ marginBottom: 16 }}>We provide a robust platform for listing IT services, managing enquiries, and building professional connections. Our platform is tailored specifically for the tech industry, ensuring that you find exactly what you need without the noise of general marketplaces.</p>
      </div>
    </div>
  );
}
