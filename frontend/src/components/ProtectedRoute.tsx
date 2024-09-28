// ==============================
// Importing React and Hooks
// ==============================
import React from "react";

// ==============================
// Importing Router Components
// ==============================
import { useRouter } from "next/router";

// ==============================
// Importing Custom Hooks
// ==============================
import { useAuth } from "../hooks/useAuth";

// ==============================
// Importing Types
// ==============================
import { ProtectedRouteProps } from "../types/types"; // Importing the type definition
const router = useRouter();

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
    router.push("/login");
    return null;
  }

  // Redirect to login if route is admin-only and user is not an admin
  if (forAdmin && !isAdmin) {
    router.push("/login");
    return null;
  }

  // Render child components if access is granted
  return <>{children}</>;
};

export default ProtectedRoute;
