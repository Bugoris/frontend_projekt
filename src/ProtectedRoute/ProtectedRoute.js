import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token, user } = useAuth();

  console.log("isAuthenticated:", isAuthenticated);
  console.log("token:", token);

  if (!isAuthenticated || user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}