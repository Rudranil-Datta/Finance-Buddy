require("dotenv").config();

const mongoose = require("mongoose");

/**
 * Connect to MongoDB Atlas using MONGODB_URI from environment.
 */
async function connectDatabase() {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment");
    }

    mongoose.set("strictQuery", true);

    await mongoose.connect(uri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

/**
 * Disconnect from MongoDB
 */
async function disconnectDatabase() {
  await mongoose.disconnect();
  console.log("MongoDB Disconnected");
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};