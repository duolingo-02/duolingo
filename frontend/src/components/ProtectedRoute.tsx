// ==============================
// Importing React and Hooks
// ==============================
import React from "react";

// ==============================
// Importing Router Components
// ==============================
import { Navigate } from "react-router-dom";

// ==============================
// Importing Custom Hooks
// ==============================
import { useAuth } from "../hooks/useAuth";

// ==============================
// Importing Types
// ==============================
import { ProtectedRouteProps } from "../types/types"; // Importing the type definition

/**
 * ProtectedRoute Component
 *
 * Guards routes based on authentication and admin status.
 *
 * @param {ProtectedRouteProps} props - Component properties.
 * @returns {JSX.Element} - Rendered child components or redirects.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isProtected = false,
  forAdmin = false,
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Redirect to login if route is protected and user is not authenticated
  if (isProtected && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if route is admin-only and user is not an admin
  if (forAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Render child components if access is granted
  return <>{children}</>;
};

export default ProtectedRoute;
