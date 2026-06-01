/**
 * Reset Demo User Script
 * This script deletes the existing demo user and all associated data,
 * then recreates it with fresh seed data
 * 
 * Run: node scripts/resetDemoUser.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const seedDemoUser = require("../config/seedDemoUser");

const DEMO_EMAIL = "user@user.com";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

// Reset demo user
const resetDemoUser = async () => {
  try {
    console.log("🔄 Finding demo user...");
    const demoUser = await User.findOne({ email: DEMO_EMAIL });

    if (demoUser) {
      console.log("🗑️  Deleting existing demo user data...");
      
      // Delete all expenses and income for demo user
      await Expense.deleteMany({ userId: demoUser._id });
      await Income.deleteMany({ userId: demoUser._id });
      
      // Delete the demo user
      await User.deleteOne({ _id: demoUser._id });
      
      console.log("✅ Demo user and data deleted successfully");
    } else {
      console.log("ℹ️  No existing demo user found");
    }

    // Recreate demo user with fresh data
    console.log("\n🌱 Creating fresh demo user...");
    await seedDemoUser();

  } catch (error) {
    console.error("❌ Error resetting demo user:", error.message);
    process.exit(1);
  }
};

// Run the reset
const run = async () => {
  console.log("🔄 Starting demo user reset...\n");
  
  await connectDB();
  await resetDemoUser();
  
  console.log("\n✨ Demo user reset complete!");
  console.log("📧 Demo Login Credentials:");
  console.log("   Email: user@user.com");
  console.log("   Password: admin");
  
  process.exit(0);
};

run().catch((error) => {
  console.error("❌ Reset failed:", error);
  process.exit(1);
});
