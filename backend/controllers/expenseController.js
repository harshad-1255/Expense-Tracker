const xlsx = require('xlsx');
const Expense = require("../models/Expense");
const { categorizeExpense } = require("../services/geminiService");

// Add Expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    let { icon, category, amount, date, description } = req.body;

    // Validation: Check for missing fields
    if (!amount || !date) {
      return res.status(400).json({ message: "Amount and date are required" });
    }

    // If description is provided and category is not, auto-categorize
    if (description && !category) {
      category = await categorizeExpense(description);
    } else if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Expenses (For Logged-in User)
exports.getAllExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense Details in Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));
    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, 'expense_details.xlsx');
    res.download('expense_details.xlsx');
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
