import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmployeeSection from "../components/Employees";
import ProjectSection from "../components/Projects";
import { useAuth } from "../store/authProvider";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentComponent, setCurrentComponent] = useState("projects");

  const selection = useMemo(() => {
    const raw = searchParams.get("selection") || "projects";
    return ["projects", "employees"].includes(raw) ? raw : "projects";
  }, [searchParams]);

  useEffect(() => {
    setCurrentComponent(selection);
  }, [selection]);

  const onSelect = (next) => {
    setCurrentComponent(next);
    setSearchParams({ selection: next });
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <button
          className={
            "px-4 py-2 rounded-lg text-sm font-medium border transition " +
            (currentComponent === "projects" ? "bg-gray-800 text-white border-gray-900" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50")
          }
          onClick={() => onSelect("projects")}
        >
          Projects
        </button>
        {user?.role === "manager" ? (
          <button
            className={
              "px-4 py-2 rounded-lg text-sm font-medium border transition " +
              (currentComponent === "employees"
                ? "bg-gray-800 text-white border-gray-900"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50")
            }
            onClick={() => onSelect("employees")}
          >
            Employees
          </button>
        ) : null}
      </div>

      {currentComponent === "employees" ? <EmployeeSection /> : <ProjectSection />}
    </div>
  );
};

export default Dashboard;
