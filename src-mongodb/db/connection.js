const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGODB_URI = 'HERE GOES THE URI';
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = connectDB;
