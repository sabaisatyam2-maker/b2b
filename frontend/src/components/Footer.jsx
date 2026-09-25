import Logo from "./Logo";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo size={24} light />
          <p style={{ marginTop: 12, fontSize: 13.5, maxWidth: 280, color: "#8890AD" }}>
            The marketplace where businesses find verified tech and IT
            service providers &mdash; and vendors find real buyers.
          </p>
        </div>
        <div>
          <h5>Platform</h5>
          <Link to="/browse">Browse services</Link>
          <Link to="/register">List your business</Link>
          <a href="/#how-it-works">How it works</a>
        </div>
        <div>
          <h5>Company</h5>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-conditions">Terms & Conditions</Link>
        </div>
      </div>
      <div className="container footer-bottom">&copy; {new Date().getFullYear()} BizSphere. All rights reserved.</div>
    </footer>
  );
}
