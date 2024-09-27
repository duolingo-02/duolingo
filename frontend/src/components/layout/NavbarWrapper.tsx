// ==============================
// Importing React and Hooks
// ==============================
import React from "react";
import { useAuth } from "../../hooks/useAuth";

// ==============================
// Importing Types and Components
// ==============================
import { NavbarWrapperProps } from "../../types/types"; // Import the separated type
import Navbar from "./Navbar";

/**
 * NavbarWrapper Component
 *
 * Wraps children components with the Navbar and manages authentication state.
 */
const NavbarWrapper: React.FC<NavbarWrapperProps> = ({ children }) => {
  const { isAuthenticated, logoutUser } = useAuth();

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} logout={logoutUser} />
      <div className="pb-24 mt-28 md:pb-12 md:mt-12">{children}</div>
    </>
  );
};

export default NavbarWrapper;
