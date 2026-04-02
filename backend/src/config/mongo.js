const mongoose = require("mongoose");

async function connectMongo(databaseUrl) {
  if (mongoose.connection.readyState === 1) {
    console.log(
      `MongoDB already connected: ${mongoose.connection.host}/${mongoose.connection.name}`
    );
    return;
  }

  console.log("Connecting to MongoDB...");
  mongoose.set("strictQuery", true);
  try {
    const conn = await mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(
      `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = { connectMongo };

