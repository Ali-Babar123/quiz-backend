const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // ==========================
    // Users collection indexes
    // ==========================
    const User = mongoose.connection.collection("users");

    try {
      await User.dropIndex("uid_1");
      console.log("🗑️ Index 'uid_1' dropped successfully");
    } catch (err) {
      if (err.code === 27) {
        console.log("ℹ️ Index 'uid_1' not found, nothing to drop");
      } else {
        console.error("❌ Error dropping 'uid_1' index:", err.message);
      }
    }

    try {
      await User.dropIndex("email_1");
      console.log("🗑️ Index 'email_1' dropped successfully");
    } catch (err) {
      if (err.code === 27) {
        console.log("ℹ️ Index 'email_1' not found, nothing to drop");
      } else {
        console.error("❌ Error dropping 'email_1' index:", err.message);
      }
    }

    // ==========================
    // Jobs collection indexes
    // ==========================
    const Job = mongoose.connection.collection("jobs");

    try {
      await Job.dropIndex("jobId_1");
      console.log("🗑️ Index 'jobId_1' dropped successfully");
    } catch (err) {
      if (err.code === 27) {
        console.log("ℹ️ Index 'jobId_1' not found, nothing to drop");
      } else {
        console.error("❌ Error dropping 'jobId_1' index:", err.message);
      }
    }

    // ==========================
    // Applications collection indexes
    // ==========================
    const Application = mongoose.connection.collection("applications");

    try {
      await Application.dropIndex("applicationId_1");
      console.log("🗑️ Index 'applicationId_1' dropped successfully");
    } catch (err) {
      if (err.code === 27) {
        console.log("ℹ️ Index 'applicationId_1' not found, nothing to drop");
      } else {
        console.error("❌ Error dropping 'applicationId_1' index:", err.message);
      }
    }

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error; // ensure the error is visible
  }
};

module.exports = connectDB;
