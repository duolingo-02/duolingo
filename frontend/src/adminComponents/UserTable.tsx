import axios from "axios";
import React, { useEffect, useState } from "react";

/**
 * UsersTable Component
 * Displays a paginated and searchable list of users with edit and delete functionalities.
 */
const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]); // State to hold users list
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [editingUser, setEditingUser] = useState<any>(null); // State for editing user
  const [userToDelete, setUserToDelete] = useState<any>(null); // State for user to delete
  const [currentPage, setCurrentPage] = useState<number>(1); // Pagination state
  const [usersPerPage, setUsersPerPage] = useState<number>(5); // Number of users per page
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Edit modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); // Delete modal visibility
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [confirmationText, setConfirmationText] = useState<string>(""); // Confirmation text for delete

  useEffect(() => {
    // Fetch all users when component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1274/api/admin/user/all"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async () => {
    if (confirmationText.toLowerCase() === "delete" && userToDelete) {
      try {
        await axios.delete(
          `http://localhost:1274/api/admin/user/delete/${userToDelete.id}`
        );
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        handleDeleteModalClose(); // Close the modal and reset the states
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else {
      alert("Please type 'delete' to confirm");
    }
  };

  // Open edit modal with selected user data
  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Open delete modal with selected user data
  const openDeleteModal = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Close edit modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Close delete modal
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setConfirmationText("");
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Handle user update submission
  const handleSubmitEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:1274/api/admin/user/update/${editingUser.id}`,
        editingUser
      );
      setUsers(
        users.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      handleModalClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle changes in user edit form
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingUser({ ...editingUser, [event.target.id]: event.target.value });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination navigation
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Handle change in number of users displayed per page
  const handleUsersPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUsersPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4 py-2 bg-white rounded-lg shadow-lg">
      {/* Search bar and users per page selector */}
      <div className="flex justify-between p-4">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-1/2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
        />
        <div className="flex justify-end">
          <label htmlFor="usersPerPage" className="mr-2">
            Users per page:
          </label>
          <select
            id="usersPerPage"
            value={usersPerPage}
            onChange={handleUsersPerPageChange}
            className="px-8 py-1 bg-gray-200 rounded-lg"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              {[
                "ID",
                "Username",
                "Email",
                "Role",
                "Total Points",
                "Created At",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 font-semibold text-left text-gray-600 border-b"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{user.id}</td>
                <td className="px-4 py-2 border-b">{user.username}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.role}</td>
                <td className="px-4 py-2 border-b">{user.totalPoints}</td>
                <td className="px-4 py-2 border-b">{user.createdAt}</td>
                <td className="flex px-4 py-2 space-x-4 border-b">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => openDeleteModal(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button
          className={`px-4 py-2 bg-gray-200 rounded-lg ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </div>
        <button
          className={`px-4 py-2 bg-gray-200 rounded-lg ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Edit User Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Edit User</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block mb-1 text-sm font-semibold"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={editingUser.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-semibold"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={editingUser.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-red-600">
              Confirm Deletion
            </h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{userToDelete.username}</span>?
              Please type <span className="font-bold">'delete'</span> to
              confirm.
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type 'delete' to confirm"
              className="w-full px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg"
            />
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={handleDeleteModalClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
