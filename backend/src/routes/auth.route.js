const express = require("express");
const { signUp, signIn, signOut } = require("../controllers/auth.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", isLoggedIn, signOut);

module.exports = router;
