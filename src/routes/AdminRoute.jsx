import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isTeamMember, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !isTeamMember) return <Navigate to="/" replace />;

  return children;
}
