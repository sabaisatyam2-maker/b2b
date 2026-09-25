export default function TermsConditions() {
  return (
    <div className="container" style={{ padding: "60px 24px" }}>
      <div className="card" style={{ maxWidth: 800, margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontSize: 32, marginBottom: 24 }}>Terms and Conditions</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>1. Acceptance of Terms</h3>
        <p style={{ marginBottom: 16 }}>By accessing and using BizSphere, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>2. User Responsibilities</h3>
        <p style={{ marginBottom: 16 }}>You are responsible for any activity that occurs under your account. You must not abuse, harass, threaten or intimidate other BizSphere users.</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>3. Vendor Responsibilities</h3>
        <p style={{ marginBottom: 16 }}>Vendors must provide accurate information about their services. Any misrepresentation may result in account termination.</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>4. Modifications to Service</h3>
        <p style={{ marginBottom: 16 }}>BizSphere reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>
      </div>
    </div>
  );
}
