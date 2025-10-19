const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.log("Failed to connect to database");
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
