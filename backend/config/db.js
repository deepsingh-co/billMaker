const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/barcodeDB";
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("DB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
