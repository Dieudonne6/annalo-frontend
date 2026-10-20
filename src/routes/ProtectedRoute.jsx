import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // TODO: remplacer par un vrai écran de chargement

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children;
}
