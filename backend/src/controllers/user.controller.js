const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.getAllEmployees = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    const employees = await User.find({ organization: organizationId, role: "employee" }).select("-password");

    return res.status(200).json({
      success: true,
      employees: employees,
    });
  } catch (error) {
    // console.log("Err in getAllEmployees:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch data of employees",
    });
  }
};

exports.getManagerOfOrganization = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    const employee = await User.findOne({ organization: organizationId, role: "manager" });

    return res.status(200).json({
      success: true,
      employee: employee,
    });
  } catch (error) {
    // console.log("Err in getManagerOfOrganization:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch data of a manager",
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    const organizationId = req.user.organization_id;
    const employee = await User.findOne({ id: id, organization: organizationId });

    return res.status(200).json({
      success: true,
      employee: employee,
    });
  } catch (error) {
    // console.log("Err in getEmployeeById:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch data of an employee",
    });
  }
};

exports.createEmployee = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email & password are required",
    });
  }
  try {
    const exisitngUser = await User.findOne({ email: email });

    if (exisitngUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const encPassword = await bcrypt.hash(password, 10);

    const userName = email.split("@")[0];

    const user = await User.create({
      name: userName,
      email: email,
      password: encPassword,
      role: "employee",
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
    });
  } catch (error) {
    // console.log("Err in createEmployee:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create new employee",
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Employee id is required",
    });
  }
  try {
    await User.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    // console.log("Err in deleteEmployee:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete employee",
    });
  }
};
