const Project = require("../models/project.model");
const User = require("../models/user.model");

exports.createProject = async (req, res) => {
  try {
    const { title, description, employees } = req.body;
    console.log(req.body);

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: "Title and description are required",
      });
    }

    const organizationId = req.user.organization_id;
    const existingProject = await Project.findOne({ title: title, organization: organizationId });

    if (existingProject) {
      return res.status(400).json({
        success: false,
        error: "Project title is already used",
      });
    }

    const newProject = await Project.create({ title, description, organization: organizationId });

    if (employees && Array.isArray(employees) && employees.length > 0) {
      for (const employeeId of employees) {
        await User.findOneAndUpdate({ _id: employeeId }, { $push: { projects: newProject._id } }, { new: true });
      }
    }

    return res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllProjectsByRole = async (req, res) => {
  try {
    let projects = [];
    if (req.user.role === "manager") {
      projects = await Project.find({ organization: req.user.organization_id });
    } else {
      console.log("inside else", req.user);

      const userDetails = await User.findById(req.user._id).select("projects");
      console.log("userDetails", userDetails);
      const projectIds = userDetails.projects || [];
      console.log("projectIds:", projectIds);

      projects = await Project.find({ _id: { $in: projectIds } });
    }

    return res.status(200).json({
      success: true,
      projects: projects,
    });
  } catch (error) {
    console.log("Err in getAllProjectsByRole:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch projects",
    });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Project id is required",
    });
  }
  try {
    const project = await Project.findById(id);

    // find _id of users where projects array has id of the project
    const employees = await User.find({ projects: id });

    return res.status(200).json({
      success: true,
      project: project,
      employees: employees,
    });
  } catch (error) {
    console.log("Err in getProjectById:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch project by id",
    });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, employees } = req.body;
  console.log("body:", req.body);
  try {
    const project = await Project.findByIdAndUpdate(id, {
      title: title,
      description: description,
    });

    if (employees && employees.length > 0) {
      await User.updateMany({ projects: id, _id: { $nin: employees } }, { $pull: { projects: id } });

      await User.updateMany({ _id: { $in: employees } }, { $addToSet: { projects: id } });

      // await User.updateMany(
      //   { _id: { $in: employees } }, // match all users in the list
      //   { $addToSet: { projects: id } } // add projectId only if not already present
      // );
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.log("Err in updateProject:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update project",
    });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(500).json({
      success: false,
      error: "Project id is required",
    });
  }

  try {
    await User.updateMany({ projects: id }, { $pull: { projects: id } });

    await Project.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Project deleted succesfully",
    });
  } catch (error) {
    console.log("Err in deleteProject:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete project",
    });
  }
};
