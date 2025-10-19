import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Axios from "../config/axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/authProvider";

const CreateProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    selectedEmployees: [],
  });

  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(location.pathname.includes("edit") ? "Edit" : "Create");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeToggle = (employee) => {
    setFormData((prev) => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.find((emp) => emp._id === employee._id)
        ? prev.selectedEmployees.filter((emp) => emp._id !== employee._id)
        : [...prev.selectedEmployees, employee],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentPage === "Edit") {
      const response = await Axios.put(`/project/${id}`, {
        title: formData.title,
        description: formData.description,
        employees: formData.selectedEmployees,
      });

      if (response?.data?.success) {
        toast.success("Project updated successfully");
        setTimeout(() => {
          navigate("/?selection=project");
        }, 3000);
      } else {
        toast.error("Failed to update project details");
      }
    } else {
      const response = await Axios.post("/project", {
        title: formData.title,
        description: formData.description,
        employees: formData.selectedEmployees,
      });

      if (response?.data?.success) {
        toast.success("Project created successfully");
        setTimeout(() => {
          navigate("/?selection=project");
        }, 3000);
      } else {
        toast.error("Failed to create new project");
      }
    }
  };

  const handleBack = () => {
    // Navigate back - you might use react-router here
    window.history.back();
  };

  const handleDataLoading = async () => {
    const response = await Axios.get(`/user/all`);
    if (response?.data?.success) {
      setAvailableEmployees(response.data.employees);
    } else {
      toast.error("Failed to fetch employees data");
    }

    if (currentPage === "Edit") {
      const projectResponse = await Axios.get(`/project/${id}`);
      if (projectResponse?.data?.success) {
        setFormData({
          ...formData,
          title: projectResponse?.data?.project?.title,
          description: projectResponse?.data?.project?.description,
          selectedEmployees: projectResponse?.data?.employees || [],
        });
      } else {
        toast.error("Failed to load project info.");
      }
    }
  };

  useEffect(() => {
    handleDataLoading();
  }, []);

  const isFormValid = formData.title.trim() && formData.description.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === "manager" ? (currentPage === "Edit" ? "Edit Project" : "Create New Project") : "View Project Details"}
          </h1>
          {user?.role === "manager" ? (
            <p className="text-gray-600 mt-2">{currentPage === "Edit" ? "Update" : "Set up"} your project details and assign team members</p>
          ) : null}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
              <input
                type="text"
                name="title"
                disabled={user?.role !== "manager"}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title..."
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
              <textarea
                name="description"
                value={formData.description}
                disabled={user?.role !== "manager"}
                onChange={handleInputChange}
                placeholder="Describe your project goals, requirements, and key details..."
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Employee Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
              <p className="text-sm text-gray-500 mb-4">Select team members to assign to this project</p>

              {/* Selected Employees Summary */}
              {formData.selectedEmployees.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Selected Team Members ({formData.selectedEmployees.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedEmployees.map((employee) => (
                      <span key={employee.id} className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {employee.avatar} {employee.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Employee Grid */}
              <div className="border border-gray-300 rounded-md p-4 max-h-80 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableEmployees.map((employee) => {
                    const isSelected = formData.selectedEmployees.find((emp) => emp._id === employee._id);
                    return (
                      <div
                        key={employee._id}
                        onClick={() => {
                          if (user?.role !== "manager") {
                            // do nothing
                          } else {
                            handleEmployeeToggle(employee);
                          }
                        }}
                        className={`p-3 border-2 rounded-md cursor-pointer transition-all ${
                          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{employee.email}</h4>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {user?.role === "manager" ? (
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    isFormValid ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {currentPage} Project
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
