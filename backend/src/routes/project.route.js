const express = require("express");
const { isLoggedIn, customRole } = require("../middlewares/auth.middleware");
const { getAllProjectsByRole, createProject, getProjectById, updateProject, deleteProject } = require("../controllers/project.controller");
const router = express.Router();

router.get("/all", isLoggedIn, customRole(["manager", "employee"]), getAllProjectsByRole);
router.post("/", isLoggedIn, customRole(["manager"]), createProject);
router.get("/:id", isLoggedIn, customRole(["manager", "employee"]), getProjectById);
router.put("/:id", isLoggedIn, customRole(["manager"]), updateProject);
router.delete("/:id", isLoggedIn, customRole(["manager"]), deleteProject);

module.exports = router;
