// ==============================
// Importing Required Libraries
// ==============================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ==============================
// Importing Components
// ==============================
import UsersTable from "../../adminComponents/UserTable";
import Languages from "../../adminComponents/Languages";

/**
 * AdminDashboard Component
 *
 * This component serves as the main dashboard for the admin. It has a sidebar for navigation and a content area
 * that dynamically renders different admin sections such as 'Users', 'Languages', etc.
 */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate(); // Navigation hook to redirect users

  // Active section state to manage which section is currently being displayed
  const [activeSection, setActiveSection] = useState<string>("users");

  // Define menu items with corresponding components in one object
  const sections = [
    {
      name: "Users",
      section: "users",
      content: <UsersTable />,
      action: () => setActiveSection("users"),
    },
    {
      name: "Languages",
      section: "languages",
      content: <Languages />,
      action: () => setActiveSection("languages"),
    },
    {
      name: "Languages",
      section: "languages",
      content: <Languages />,
      action: () => setActiveSection("languages"),
    },
    // {
    //   name: "Logout",
    //   section: "logout",
    //   content: null, // No content for logout, just action
    //   action: () => navigate("/login"),
    // },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 p-6 mt-6 ml-6 bg-white rounded-lg shadow-lg">
        {/* Admin Panel Title */}
        <div className="p-4 text-xl font-bold border-b">Admin Panel</div>

        {/* Sidebar Navigation Links */}
        <ul className="mt-4 space-y-2">
          {sections.map((item) => (
            <li
              key={item.section}
              className={`p-4 cursor-pointer hover:bg-gray-200 ${
                activeSection === item.section ? "bg-gray-200 rounded-lg" : ""
              }`}
              onClick={item.action}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 mt-6 ml-2 mr-6 bg-white rounded-lg shadow-lg">
        {sections.find((item) => item.section === activeSection)?.content}
        {/* Renders the corresponding content based on the active section */}
      </main>
    </div>
  );
};

export default AdminDashboard;
