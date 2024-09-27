import React, { useState, useEffect } from "react";
import axios from "axios";

const Languages: React.FC = () => {
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingLanguage, setEditingLanguage] = useState<any>(null);
  const [languageToDelete, setLanguageToDelete] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [languagesPerPage, setLanguagesPerPage] = useState<number>(5);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [confirmationText, setConfirmationText] = useState<string>("");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1274/api/admin/languages/all"
        );
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Handle deleting a language
  const handleDelete = async () => {
    if (confirmationText.toLowerCase() === "delete" && languageToDelete) {
      try {
        await axios.delete(
          `http://localhost:1274/api/admin/languages/${languageToDelete.id}`
        );
        setLanguages(
          languages.filter((language) => language.id !== languageToDelete.id)
        );
        handleDeleteModalClose();
      } catch (error) {
        console.error("Error deleting language:", error);
      }
    } else {
      alert("Please type 'delete' to confirm.");
    }
  };

  // Open the edit modal
  const handleEdit = (language: any) => {
    setEditingLanguage(language);
    setIsModalOpen(true);
  };

  // Open the delete modal
  const openDeleteModal = (language: any) => {
    setLanguageToDelete(language);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingLanguage(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setLanguageToDelete(null);
    setConfirmationText("");
  };

  // Handle editing form submission
  const handleSubmitEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:1274/api/admin/languages/${editingLanguage.id}`,
        editingLanguage
      );
      setLanguages(
        languages.map((language) =>
          language.id === editingLanguage.id ? editingLanguage : language
        )
      );
      handleModalClose();
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  // Handle changes in the edit form
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingLanguage({
      ...editingLanguage,
      [event.target.id]: event.target.value,
    });
  };

  // Search functionality
  const filteredLanguages = languages.filter(
    (language) =>
      language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastLanguage = currentPage * languagesPerPage;
  const indexOfFirstLanguage = indexOfLastLanguage - languagesPerPage;
  const currentLanguages = filteredLanguages.slice(
    indexOfFirstLanguage,
    indexOfLastLanguage
  );
  const totalPages = Math.ceil(filteredLanguages.length / languagesPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Handle change in the number of languages displayed per page
  const handleLanguagesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguagesPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4 py-2 bg-white rounded-lg shadow-lg">
      {/* Search bar and items per page */}
      <div className="flex justify-between p-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
        />
        <div className="flex justify-end">
          <label htmlFor="languagesPerPage" className="mr-2">
            Languages per page:
          </label>
          <select
            id="languagesPerPage"
            value={languagesPerPage}
            onChange={handleLanguagesPerPageChange}
            className="px-8 py-1 bg-gray-200 rounded-lg"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
      </div>

      {/* Languages Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              {["ID", "Name", "Description", "Actions"].map((header) => (
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
            {currentLanguages.map((language) => (
              <tr key={language.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{language.id}</td>
                <td className="px-4 py-2 border-b">{language.name}</td>
                <td className="px-4 py-2 border-b">{language.description}</td>
                <td className="flex px-4 py-2 space-x-4 border-b">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEdit(language)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => openDeleteModal(language)}
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

      {/* Edit Language Modal */}
      {isModalOpen && editingLanguage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Edit Language</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-semibold"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={editingLanguage.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block mb-1 text-sm font-semibold"
                >
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={editingLanguage.description}
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
      {isDeleteModalOpen && languageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-red-600">
              Confirm Deletion
            </h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{languageToDelete.name}</span>?
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

export default Languages;
