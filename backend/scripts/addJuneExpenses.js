require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Expense = require("../models/Expense");

/**
 * Add June 2026 Expenses to Demo User
 * This script adds 15-20 realistic expenses for June to test
 * - Monthly comparisons (May vs June)
 * - Category breakdown
 * - AI summary generation
 * - Month-to-month trends
 */
const addJuneExpenses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find demo user
    const demoUser = await User.findOne({ email: "user@user.com" });
    if (!demoUser) {
      console.error("❌ Demo user not found. Please seed demo user first.");
      process.exit(1);
    }

    console.log(`✅ Found demo user: ${demoUser.email}`);

    // June 2026 expenses - varied and realistic
    const juneExpenses = [
      // Week 1
      {
        userId: demoUser._id,
        icon: "🍔",
        category: "Food",
        amount: 450,
        date: new Date(2026, 5, 2), // June 2
      },
      {
        userId: demoUser._id,
        icon: "🚕",
        category: "Travel",
        amount: 280,
        date: new Date(2026, 5, 2),
      },
      {
        userId: demoUser._id,
        icon: "🛒",
        category: "Groceries",
        amount: 2800,
        date: new Date(2026, 5, 3),
      },
      {
        userId: demoUser._id,
        icon: "☕",
        category: "Coffee",
        amount: 180,
        date: new Date(2026, 5, 4),
      },
      {
        userId: demoUser._id,
        icon: "🏥",
        category: "Healthcare",
        amount: 800,
        date: new Date(2026, 5, 5),
      },
      {
        userId: demoUser._id,
        icon: "🍕",
        category: "Food",
        amount: 520,
        date: new Date(2026, 5, 6),
      },

      // Week 2
      {
        userId: demoUser._id,
        icon: "👕",
        category: "Shopping",
        amount: 3200,
        date: new Date(2026, 5, 9),
      },
      {
        userId: demoUser._id,
        icon: "🎬",
        category: "Entertainment",
        amount: 450,
        date: new Date(2026, 5, 10),
      },
      {
        userId: demoUser._id,
        icon: "⚡",
        category: "Utilities",
        amount: 1900,
        date: new Date(2026, 5, 11),
      },
      {
        userId: demoUser._id,
        icon: "🍜",
        category: "Food",
        amount: 380,
        date: new Date(2026, 5, 12),
      },
      {
        userId: demoUser._id,
        icon: "🚌",
        category: "Travel",
        amount: 320,
        date: new Date(2026, 5, 13),
      },

      // Week 3
      {
        userId: demoUser._id,
        icon: "🛍️",
        category: "Shopping",
        amount: 1800,
        date: new Date(2026, 5, 16),
      },
      {
        userId: demoUser._id,
        icon: "🍛",
        category: "Food",
        amount: 650,
        date: new Date(2026, 5, 17),
      },
      {
        userId: demoUser._id,
        icon: "📱",
        category: "Mobile Recharge",
        amount: 399,
        date: new Date(2026, 5, 18),
      },
      {
        userId: demoUser._id,
        icon: "🎸",
        category: "Entertainment",
        amount: 1200,
        date: new Date(2026, 5, 19),
      },
      {
        userId: demoUser._id,
        icon: "🥗",
        category: "Groceries",
        amount: 1500,
        date: new Date(2026, 5, 20),
      },

      // Week 4
      {
        userId: demoUser._id,
        icon: "🍱",
        category: "Food",
        amount: 500,
        date: new Date(2026, 5, 23),
      },
      {
        userId: demoUser._id,
        icon: "🏋️",
        category: "Healthcare",
        amount: 600,
        date: new Date(2026, 5, 24),
      },
      {
        userId: demoUser._id,
        icon: "🚕",
        category: "Travel",
        amount: 450,
        date: new Date(2026, 5, 25),
      },
      {
        userId: demoUser._id,
        icon: "🛀",
        category: "Utilities",
        amount: 800,
        date: new Date(2026, 5, 26),
      },
      {
        userId: demoUser._id,
        icon: "🎪",
        category: "Entertainment",
        amount: 800,
        date: new Date(2026, 5, 27),
      },
    ];

    // Insert June expenses
    const result = await Expense.insertMany(juneExpenses);
    console.log(
      `\n✅ Successfully added ${result.length} June 2026 expenses to database!`
    );

    // Calculate totals
    const totalJuneAmount = juneExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    console.log(`💰 Total June spending: ₹${totalJuneAmount.toLocaleString()}`);

    // Category breakdown
    const categories = {};
    juneExpenses.forEach((exp) => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });

    console.log("\n📊 June Spending by Category:");
    Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .forEach(([cat, amount]) => {
        console.log(
          `   ${cat}: ₹${amount.toLocaleString()} (${((amount / totalJuneAmount) * 100).toFixed(1)}%)`
        );
      });

    console.log("\n✨ Your app now has:");
    console.log("   📅 May 2026: ~10 expenses (₹27,499)");
    console.log(
      `   📅 June 2026: ${result.length} expenses (₹${totalJuneAmount.toLocaleString()})`
    );
    console.log("   ✅ Ready for AI summary and month-to-month comparison!");
    console.log("\n🌐 This data is now in MongoDB and will be available on Vercel!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding June expenses:", error.message);
    process.exit(1);
  }
};

addJuneExpenses();
