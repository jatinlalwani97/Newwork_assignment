const express = require("express");
const { getAllEmployees, getManagerOfOrganization, getEmployeeById, createEmployee, deleteEmployee } = require("../controllers/user.controller");
const { isLoggedIn, customRole } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/all", isLoggedIn, customRole(["manager", "employee"]), getAllEmployees);
router.get("/manager", isLoggedIn, customRole(["manager", "employee"]), getManagerOfOrganization);
router.post("/", isLoggedIn, customRole(["manager"]), createEmployee);
router.get("/:id", isLoggedIn, customRole(["manager", "employee"]), getEmployeeById);
router.delete("/:id", isLoggedIn, customRole(["manager"]), deleteEmployee);

module.exports = router;
