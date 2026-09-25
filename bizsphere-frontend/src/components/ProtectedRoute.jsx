import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap a page that needs login (and optionally a specific role) with this.
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
  
}
