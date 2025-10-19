require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDatabase = require("./src/config/db.config");

// routes
const authRoutes = require("./src/routes/auth.route");
const userRoutes = require("./src/routes/user.route");
const projectRoutes = require("./src/routes/project.route");

// middlewares
app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Application is completely healthy!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);

const port = process.env.PORT || 8000;
app.listen(port, async () => {
  await connectDatabase();
  console.log(`Server is running on port ${port}`);
});
