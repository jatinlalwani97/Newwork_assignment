import React, { useState, useEffect } from "react";
import Axios from "../config/axios";
import { toast } from "react-toastify";

const EmployeeRow = ({ employee, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{employee.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{employee.email}</td>
      <td className="px-4 py-3 text-sm text-gray-600 uppercase">{employee.role}</td>
      <td className="px-4 py-3 text-right">
        <div className="inline-flex items-center gap-2">
          <button onClick={() => onDelete(employee)} className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

const CreateEmployeeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onSubmit(formData);
      setFormData({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Failed to create employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: "", password: "" });
    setError("");
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Create New Employee</h3>
          <button onClick={handleClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  {/* {console.log("form err:", error)} */}
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter employee email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmployeeSection = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (employee) => {
    alert(`Edit employee: ${employee.name}`);
  };

  const handleDelete = async (employee) => {
    const response = await Axios.delete(`/user/${employee._id}`);

    if (response?.data?.success) {
      toast.success("Employee deleted successfully");
    } else {
      toast.error("Failed to delete project");
    }
  };

  const handleCreateEmployee = async (formData) => {
    // console.log("Creating employee with data:", formData);
    const response = await Axios.post("/user", formData);

    if (response?.data?.success) {
      toast.success("Employee created successfully");
      setIsModalOpen(false);
    } else {
      toast.error("Failed to create new employee");
    }
  };

  const handleDataLoading = async () => {
    const response = await Axios.get("/user/all");
    // console.log("response:", response.data);

    if (response?.data?.success) {
      setEmployees(response?.data?.employees);
    } else {
      toast.error("Failed to load employees data");
    }
  };

  useEffect(() => {
    handleDataLoading();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with title and create button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Employee
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Role</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <EmployeeRow key={emp.id} employee={emp} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-600">
                  No employees yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CreateEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateEmployee} />
    </div>
  );
};

export default EmployeeSection;
