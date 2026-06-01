const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { generateMonthlySummary } = require("../services/geminiService");

/**
 * Generate AI summary for current month expenses
 */
exports.getMonthlySummary = async (req, res) => {
  const userId = req.user.id;

  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Get current month's expenses
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);

    const currentMonthExpenses = await Expense.find({
      userId,
      date: { $gte: currentMonthStart, $lte: currentMonthEnd },
    });

    // Get previous month's total for comparison
    const previousMonthStart = new Date(previousYear, previousMonth, 1);
    const previousMonthEnd = new Date(previousYear, previousMonth + 1, 0);

    const previousMonthExpenses = await Expense.find({
      userId,
      date: { $gte: previousMonthStart, $lte: previousMonthEnd },
    });

    // Calculate totals
    const totalSpent = currentMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const previousMonthTotal = previousMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Calculate category breakdown
    const categoryBreakdown = {};
    currentMonthExpenses.forEach((expense) => {
      categoryBreakdown[expense.category] =
        (categoryBreakdown[expense.category] || 0) + expense.amount;
    });

    // Generate summary using Gemini
    const monthlyData = {
      totalSpent,
      categoryBreakdown,
      previousMonthTotal: previousMonthTotal || null,
    };

    const summary = await generateMonthlySummary(monthlyData);

    res.json({
      success: true,
      month: `${new Date(currentYear, currentMonth).toLocaleString("default", {
        month: "long",
      })} ${currentYear}`,
      data: {
        totalSpent,
        categoryBreakdown,
        previousMonthTotal,
      },
      summary: summary.summary,
      generatedAt: summary.generatedAt,
    });
  } catch (error) {
    console.error("Error generating monthly summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate summary",
      error: error.message,
    });
  }
};

/**
 * Categorize an expense using AI
 */
exports.categorizeExpense = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const { categorizeExpense: categorize } = require("../services/geminiService");
    const category = await categorize(description);

    res.json({
      success: true,
      category,
      description,
    });
  } catch (error) {
    console.error("Error categorizing expense:", error);
    res.status(500).json({
      success: false,
      message: "Failed to categorize expense",
      error: error.message,
    });
  }
};
