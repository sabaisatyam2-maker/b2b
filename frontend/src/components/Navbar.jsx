import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const is = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/"><Logo /></Link>
        <nav className="nav-links">
          <Link to="/services" className={is("/services") ? "active" : ""}>Services</Link>
          <Link to="/browse" className={is("/browse") ? "active" : ""}>Vendors</Link>
          {!user && <Link to="/login" className={is("/login") ? "active" : ""}>Login</Link>}
          {!user && <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>}
          {user && user.role === "vendor" && (
            <Link to="/vendor/dashboard" className={is("/vendor/dashboard") ? "active" : ""}>My Dashboard</Link>
          )}
          {user && user.role === "admin" && (
            <Link to="/admin/dashboard" className={is("/admin/dashboard") ? "active" : ""}>Admin</Link>
          )}
          {user && user.role === "user" && (
            <span className="nav-user">Hi, {user.name}</span>
          )}
          {user && <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>}
        </nav>
      </div>
    </header>
  );
}
