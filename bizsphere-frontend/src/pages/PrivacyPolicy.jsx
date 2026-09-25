export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: "60px 24px" }}>
      <div className="card" style={{ maxWidth: 800, margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontSize: 32, marginBottom: 24 }}>Privacy Policy</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>1. Information We Collect</h3>
        <p style={{ marginBottom: 16 }}>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us.</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>2. How We Use Your Information</h3>
        <p style={{ marginBottom: 16 }}>We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support to Users and Vendors, develop safety features, authenticate users, and send product updates and administrative messages.</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>3. Sharing of Information</h3>
        <p style={{ marginBottom: 16 }}>We may share the information we collect about you with vendors you contact, in order to facilitate your request for services.</p>
        
        <h3 style={{ marginTop: 24, marginBottom: 12 }}>4. Security</h3>
        <p style={{ marginBottom: 16 }}>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
      </div>
    </div>
  );
}
