const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organization = require("../models/organization.model");

exports.signUp = async (req, res) => {
  const { email, name, password } = req.body;

  // validate
  if (!email || !name || !password) {
    return res.status(400).json({
      success: false,
      error: "Organization Name, email and password are required",
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
      role: "manager",
    });

    // create organization
    const organization = await Organization.create({
      title: name,
      manager: user._id,
    });

    // remove password
    user.password = undefined;

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log("Err in signup:", error);
    return res.status(500).json({
      error: "Failed to register new organization",
    });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  // validate
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email & password are required",
    });
  }
  try {
    const exisitngUser = await User.findOne({ email: email });

    if (!exisitngUser) {
      return res.status(400).json({
        success: false,
        error: "Email not registered yet",
      });
    }

    const isValidPassword = await bcrypt.compare(password, exisitngUser.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: "Email & password are not matching",
      });
    }

    const token = await jwt.sign({ id: exisitngUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    exisitngUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Done",
      user: exisitngUser,
      token: token,
    });
  } catch (error) {
    console.log("Err in signin:", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "Logout Done",
  });
};
