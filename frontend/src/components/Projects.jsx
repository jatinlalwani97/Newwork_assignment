import React, { useEffect, useState } from "react";
import Axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/authProvider";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { user } = useAuth();

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{project.title}</h3>
          <div className="mt-1 text-sm text-gray-600">{project.description}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(project)}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
          >
            {user.role === "manager" ? "Edit" : "View"}
          </button>
          {user && user.role === "manager" ? (
            <button onClick={() => onDelete(project)} className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white">
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ProjectSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const handleDelete = async (project) => {
    const response = await Axios.delete(`/project/${project._id}`);

    if (response?.data?.success) {
      toast.success("Project deleted successfully");
      handleLoadingProjects();
    } else {
      toast.error("Failed to delete project");
    }
  };

  const handleCreateProject = () => {
    navigate("/project/create");
  };

  const handleLoadingProjects = async () => {
    const response = await Axios.get(`/project/all`);

    if (response?.data?.success) {
      setProjects(response.data.projects);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    handleLoadingProjects();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
        {user.role === "manager" ? (
          <button onClick={handleCreateProject} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white">
            Create Project
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <p>loading ...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={() => {
                navigate(`/project/edit/${p._id}`);
              }}
              onDelete={handleDelete}
            />
          ))}
          {projects.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">No projects yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectSection;
