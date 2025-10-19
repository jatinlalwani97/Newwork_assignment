/**
 * Authentication - signin or not
 * Authorization - role based and account based
 */
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// authentication
exports.isLoggedIn = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    if (!token) {
      return res.status(401).json({
        error: "Unauthenticated user",
      });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "Unauthenticated user",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    // console.log(error);
    return res.status(401).json({
      error: "Unauthenticated user",
    });
  }
};

// authorization
exports.customRole = (...acceptedRoles) => {
  return (req, res, next) => {
    // Normalize roles: support both customRole('admin', 'student') and customRole(['admin', 'student'])
    const roles = Array.isArray(acceptedRoles[0]) ? acceptedRoles[0] : acceptedRoles;

    const userRole = req.user && req.user.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: "You are not allowed for this resource" });
    }
    next();
  };
};
