const User = require("../models/User");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const bcrypt = require("bcryptjs");

/**
 * Demo User Credentials for Recruiters/Interviewers
 * Email: user@user.com
 * Password: admin
 * 
 * This function ensures a demo user with pre-seeded data exists
 * for demonstration purposes without affecting other users.
 */
const seedDemoUser = async () => {
  try {
    const DEMO_EMAIL = "user@user.com";
    const DEMO_PASSWORD = "admin";
    const DEMO_NAME = "Demo User";

    // Check if demo user already exists
    let demoUser = await User.findOne({ email: DEMO_EMAIL });

    if (demoUser) {
      console.log("✅ Demo user already exists");
      return;
    }

    // Create demo user (password will be hashed by User model's pre-save hook)
    console.log("🔄 Creating demo user...");
    
    demoUser = await User.create({
      fullName: DEMO_NAME,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD, // Plain password - will be hashed by pre-save hook
      profileImageUrl: null,
    });

    console.log("✅ Demo user created successfully");

    // Seed demo expenses
    await seedDemoExpenses(demoUser._id);

    // Seed demo income
    await seedDemoIncome(demoUser._id);

    console.log("✅ Demo data seeded successfully");
    console.log(`📧 Demo Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);

  } catch (error) {
    console.error("❌ Error seeding demo user:", error.message);
  }
};

/**
 * Seeds realistic expense data for the demo user
 * Includes various categories spread across multiple dates
 */
const seedDemoExpenses = async (userId) => {
  try {
    // Check if demo expenses already exist
    const existingExpenses = await Expense.countDocuments({ userId });
    if (existingExpenses > 0) {
      console.log("✅ Demo expenses already exist");
      return;
    }

    const today = new Date();
    const expenses = [
      // Last 30 days expenses
      {
        userId,
        icon: null,
        category: "Food",
        amount: 850,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      },
      {
        userId,
        icon: null,
        category: "Travel",
        amount: 1200,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      },
      {
        userId,
        icon: null,
        category: "Rent",
        amount: 15000,
        date: new Date(today.getFullYear(), today.getMonth(), 1),
      },
      {
        userId,
        icon: null,
        category: "Groceries",
        amount: 3500,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
      },
      {
        userId,
        icon: null,
        category: "Entertainment",
        amount: 600,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
      },
      {
        userId,
        icon: null,
        category: "Shopping",
        amount: 2400,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12),
      },
      {
        userId,
        icon: null,
        category: "Utilities",
        amount: 1800,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15),
      },
      {
        userId,
        icon: null,
        category: "Healthcare",
        amount: 1500,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 18),
      },
      {
        userId,
        icon: null,
        category: "Mobile Recharge",
        amount: 399,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20),
      },
      {
        userId,
        icon: null,
        category: "Coffee",
        amount: 250,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      },
    ];

    await Expense.insertMany(expenses);
    console.log(`✅ ${expenses.length} demo expenses created`);
  } catch (error) {
    console.error("❌ Error seeding demo expenses:", error.message);
  }
};

/**
 * Seeds realistic income data for the demo user
 * Includes salary and other income sources
 */
const seedDemoIncome = async (userId) => {
  try {
    // Check if demo income already exists
    const existingIncome = await Income.countDocuments({ userId });
    if (existingIncome > 0) {
      console.log("✅ Demo income already exists");
      return;
    }

    const today = new Date();
    const incomes = [
      {
        userId,
        icon: null,
        source: "Salary",
        amount: 50000,
        date: new Date(today.getFullYear(), today.getMonth(), 1),
      },
      {
        userId,
        icon: null,
        source: "Freelance",
        amount: 15000,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
      },
      {
        userId,
        icon: null,
        source: "Investment",
        amount: 5000,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15),
      },
      {
        userId,
        icon: null,
        source: "Bonus",
        amount: 10000,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      },
      {
        userId,
        icon: null,
        source: "Side Project",
        amount: 8000,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20),
      },
    ];

    await Income.insertMany(incomes);
    console.log(`✅ ${incomes.length} demo income records created`);
  } catch (error) {
    console.error("❌ Error seeding demo income:", error.message);
  }
};

module.exports = seedDemoUser;
