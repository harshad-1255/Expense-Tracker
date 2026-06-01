/**
 * Standalone seed script to create demo user and data
 * Run this script manually: node scripts/seed.js
 * 
 * This script can be used to:
 * - Initialize demo data for the first time
 * - Reset demo user data if needed
 * - Verify demo account setup
 */

require("dotenv").config();
const mongoose = require("mongoose");
const seedDemoUser = require("../config/seedDemoUser");

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

// Run seeding process
const runSeed = async () => {
  console.log("🌱 Starting seed process...\n");
  
  await connectDB();
  await seedDemoUser();
  
  console.log("\n✨ Seeding complete!");
  console.log("📧 Demo Login Credentials:");
  console.log("   Email: user@user.com");
  console.log("   Password: admin");
  
  process.exit(0);
};

// Execute seeding
runSeed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
