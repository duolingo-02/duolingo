// ==============================
// Importing React and Hooks
// ==============================
import React, { useEffect, useState } from "react";

// ==============================
// Importing Icons
// ==============================
import { FaBars, FaTimes } from "react-icons/fa";

// ==============================
// Importing Router Components
// ==============================
import { Link, useLocation } from "react-router-dom";

// ==============================
// Importing SVG Icons as React Components
// ==============================
import { ReactComponent as TrophyIcon } from "../../assets/icons/achivement.svg";
import { ReactComponent as Icon } from "../../assets/icons/icon.svg";
import { ReactComponent as Admin } from "../../assets/icons/admin.svg";
import { ReactComponent as HomeIcon } from "../../assets/icons/learn.svg";
import { ReactComponent as ProfileIcon } from "../../assets/icons/profile.svg";

// ==============================
// Importing Types and Auth Hook
// ==============================
import { NavbarProps } from "../../types/types"; // Type definition for Navbar
import { useAuth } from "../../hooks/useAuth"; // Using useAuth hook for authentication

const Navbar: React.FC<NavbarProps> = ({ logout }) => {
  // State for sidebar visibility
  const [isOpen, setIsOpen] = useState(false);
  // State for detecting scroll direction
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Using useAuth hook to check if user is authenticated and admin
  const { isAuthenticated, isAdmin, logoutUser } = useAuth();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Manage navbar visibility based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setIsScrollingUp(false);
      } else {
        setIsScrollingUp(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Check if the current path matches the given path
  const isActive = (path: string) => location.pathname === path;

  return (
    <div>
      {/* Mobile Logo Bar */}
      <div
        className={`fixed inset-x-0 top-0 z-50 bg-duolingoDark p-4 md:hidden transition-transform duration-300 ease-in-out ${
          isScrollingUp ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-center">
          <Icon className="w-10 h-10" />
          <h1 className="flex text-3xl font-bold text-duolingoGreen logoTitle">
            LINGOLEAP
          </h1>
        </div>
      </div>

      {/* Desktop Sidebar Toggle */}
      <div className="hidden md:block">
        <div className="fixed z-50 flex items-center top-4 left-4">
          <button
            className="flex items-center p-2 rounded-full text-duolingoLight bg-duolingoDark focus:outline-none focus:ring"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
          {!isOpen && (
            <div className="flex items-center ml-4 opacity-100">
              <Icon className="w-10 h-10 mr-2" />
              <h1 className="text-3xl font-bold text-duolingoGreen logoTitle">
                LINGOLEAP
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div
        className={`fixed top-0 left-0 z-40 flex flex-col h-screen p-6 shadow-xl bg-duolingoDark transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-1/5`}
      >
        <div className="flex justify-center mb-10 mt-14">
          <Icon className="w-10 h-10" />
          <h1 className="flex text-3xl font-bold text-duolingoGreen logoTitle">
            LINGOLEAP
          </h1>
        </div>

        <ul className="flex flex-col space-y-8">
          <li className="flex items-center gap-4 group">
            <span className="p-3 transition-transform duration-300 rounded-full shadow-lg bg-duolingoGreen group-hover:scale-110">
              <HomeIcon className="w-6 h-6 text-duolingoLight" />
            </span>
            <Link
              to="/home"
              className={`text-xl font-medium ${
                isActive("/home")
                  ? "text-duolingoGreen"
                  : "text-duolingoLight group-hover:text-duolingoGreen"
              } transition-colors duration-300`}
            >
              Learn
            </Link>
          </li>
          <li className="flex items-center gap-4 group">
            <span className="p-3 transition-transform duration-300 rounded-full shadow-lg bg-duolingoBlue group-hover:scale-110">
              <TrophyIcon className="w-6 h-6 text-duolingoDark" />
            </span>
            <Link
              to="/achievements"
              className={`text-xl font-medium ${
                isActive("/achievements")
                  ? "text-duolingoGreen"
                  : "text-duolingoLight group-hover:text-duolingoGreen"
              } transition-colors duration-300`}
            >
              Achievements
            </Link>
          </li>
          <li className="flex items-center gap-4 group">
            <span className="p-3 transition-transform duration-300 rounded-full shadow-lg bg-duolingoYellow group-hover:scale-110">
              <ProfileIcon className="w-6 h-6 text-duolingoLight" />
            </span>
            <Link
              to="/profile"
              className={`text-xl font-medium ${
                isActive("/profile")
                  ? "text-duolingoGreen"
                  : "text-duolingoLight group-hover:text-duolingoGreen"
              } transition-colors duration-300`}
            >
              Profile
            </Link>
          </li>

          {/* Conditionally render the Admin Dashboard link */}
          {isAdmin && (
            <li className="flex items-center gap-4 group">
              <span className="p-3 transition-transform duration-300 rounded-full shadow-lg bg-duolingoGrayDark group-hover:scale-110">
                <Admin className="w-6 h-6 text-duolingoLight" />
              </span>
              <Link
                to="/admin-dashboard"
                className={`text-xl font-medium ${
                  isActive("/admin-dashboard")
                    ? "text-duolingoGreen"
                    : "text-duolingoLight group-hover:text-duolingoGreen"
                } transition-colors duration-300`}
              >
                Admin Panel
              </Link>
            </li>
          )}
        </ul>

        {/* Logout Button */}
        <div className="mt-auto">
          {isAuthenticated && (
            <button
              className="w-full py-3 text-xl font-bold transition-transform duration-300 bg-red-500 rounded-full shadow-lg text-duolingoLight hover:bg-red-600 hover:scale-105"
              onClick={logoutUser}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Overlay to Close Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-50 block bg-duolingoGreen md:hidden">
        <div className="flex justify-around p-4">
          <Link
            to="/home"
            className="flex flex-col items-center transition-all duration-300 ease-in-out"
          >
            <HomeIcon className="w-6 h-6 mb-1 text-duolingoLight" />
            <span
              className={`text-xs transition-all duration-300 ease-in-out ${
                isActive("/home")
                  ? "bg-duolingoLight text-duolingoDark rounded-full px-2 shadow-lg"
                  : "text-duolingoLight hover:bg-duolingoLight hover:text-duolingoDark hover:rounded-full hover:shadow-md"
              }`}
            >
              Learn
            </span>
          </Link>
          <Link
            to="/achievements"
            className="flex flex-col items-center transition-all duration-300 ease-in-out"
          >
            <TrophyIcon className="w-6 h-6 mb-1 text-duolingoLight" />
            <span
              className={`text-xs transition-all duration-300 ease-in-out ${
                isActive("/achievements")
                  ? "bg-duolingoLight text-duolingoDark rounded-full px-2 shadow-lg"
                  : "text-duolingoLight hover:bg-duolingoLight hover:text-duolingoDark hover:rounded-full hover:shadow-md"
              }`}
            >
              Achievements
            </span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center transition-all duration-300 ease-in-out"
          >
            <ProfileIcon className="w-6 h-6 mb-1 text-duolingoLight" />
            <span
              className={`text-xs transition-all duration-300 ease-in-out ${
                isActive("/profile")
                  ? "bg-duolingoLight text-duolingoDark rounded-full px-2 shadow-lg"
                  : "text-duolingoLight hover:bg-duolingoLight hover:text-duolingoDark hover:rounded-full hover:shadow-md"
              }`}
            >
              Profile
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
