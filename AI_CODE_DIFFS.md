# AI Features - Complete Code Diffs

This document contains complete before/after code diffs for all modified files.

---

## File: backend/server.js

### Changes Made:
- Added `aiRoutes` import
- Added AI routes middleware

```diff
--- a/backend/server.js
+++ b/backend/server.js
@@ -6,6 +6,7 @@ const connectDB = require("./config/db");
 const seedDemoUser = require("./config/seedDemoUser");
 const authRoutes = require("./routes/authRoutes");
 const incomeRoutes = require("./routes/incomeRoutes");
 const expenseRoutes = require("./routes/expenseRoutes");
 const dashboardRoutes = require("./routes/dashboardRoutes");
+const aiRoutes = require("./routes/aiRoutes");
 
 const app = express();

@@ -33,6 +34,7 @@ connectDB().then(() => {
 app.use("/api/v1/auth", authRoutes);
 app.use("/api/v1/income", incomeRoutes);
 app.use("/api/v1/expense", expenseRoutes);
 app.use("/api/v1/dashboard", dashboardRoutes);
+app.use("/api/v1/ai", aiRoutes);
 
 // Serve uploads folder
 app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

---

## File: backend/controllers/expenseController.js

### Changes Made:
- Added Gemini service import
- Modified `addExpense` to support auto-categorization

```diff
--- a/backend/controllers/expenseController.js
+++ b/backend/controllers/expenseController.js
@@ -1,10 +1,12 @@
 const xlsx = require('xlsx');
 const Expense = require("../models/Expense");
+const { categorizeExpense } = require("../services/geminiService");
 
 // Add Expense
 exports.addExpense = async (req, res) => {
   const userId = req.user.id;
 
   try {
-    const { icon, category, amount, date } = req.body;
+    let { icon, category, amount, date, description } = req.body;
 
     // Validation: Check for missing fields
-    if (!category || !amount || !date) {
-      return res.status(400).json({ message: "All fields are required" });
+    if (!amount || !date) {
+      return res.status(400).json({ message: "Amount and date are required" });
     }
 
+    // If description is provided and category is not, auto-categorize
+    if (description && !category) {
+      category = await categorizeExpense(description);
+    } else if (!category) {
+      return res.status(400).json({ message: "Category is required" });
+    }
+
     const newExpense = new Expense({
       userId,
       icon,
@@ -23,7 +35,8 @@ exports.addExpense = async (req, res) => {
     await newExpense.save();
     res.status(200).json(newExpense);
   } catch (error) {
+    console.error("Error adding expense:", error);
-    res.status(500).json({ message: "Server Error" });
+    res.status(500).json({ message: "Server Error", error: error.message });
   }
 };
```

---

## File: backend/.env

### Changes Made:
- Added GEMINI_API_KEY configuration

```diff
--- a/backend/.env
+++ b/backend/.env
@@ -1,4 +1,5 @@
 MONGO_URI=mongodb://localhost:27017/expense-tracker
 PORT=5001
 CLIENT_URL=http://localhost:5173
 JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
+GEMINI_API_KEY=your_gemini_api_key_here
```

---

## File: frontend/src/utils/apiPaths.js

### Changes Made:
- Added AI section to API_PATHS

```diff
--- a/frontend/src/utils/apiPaths.js
+++ b/frontend/src/utils/apiPaths.js
@@ -22,6 +22,11 @@ export const API_PATHS = {
     DELETE_EXPENSE: (expenseId) =>  `/api/v1/expense/${expenseId}`,
     DOWNLOAD_EXPENSE: `/api/v1/expense/downloadexcel`,
   },
+  AI: {
+    MONTHLY_SUMMARY: "/api/v1/ai/monthly-summary",
+    CATEGORIZE_EXPENSE: "/api/v1/ai/categorize",
+  },
   IMAGE: {
     UPLOAD_IMAGE: "/api/v1/auth/upload-image",
   },
```

---

## File: frontend/src/components/Expense/AddExpenseForm.jsx

### Changes Made:
- Added description field
- Integrated auto-categorization with "Suggest Category" button
- Added useAutoCategory hook

```diff
--- a/frontend/src/components/Expense/AddExpenseForm.jsx
+++ b/frontend/src/components/Expense/AddExpenseForm.jsx
@@ -1,9 +1,21 @@
 import React, { useState } from "react";
 import Input from "../Inputs/Input";
 import EmojiPickerPopup from "../EmojiPickerPopup";
+import { useAutoCategory } from "../../hooks/useAI";
+import toast from "react-hot-toast";
 
 const AddExpenseForm = ({onAddExpense}) => {
   const [income, setIncome] = useState({
     category: "",
+    description: "",
     amount: "",
     date: "",
     icon: "",
   });
 
+  const { loading: categorizing, categorizeDescription } = useAutoCategory();
+
   const handleChange = (key, value) => setIncome({ ...income, [key]: value });
 
+  const handleSuggestCategory = async () => {
+    if (!income.description.trim()) {
+      toast.error("Please enter a description first");
+      return;
+    }
+
+    try {
+      const suggestedCategory = await categorizeDescription(income.description);
+      if (suggestedCategory) {
+        handleChange("category", suggestedCategory);
+        toast.success(`Category suggested: ${suggestedCategory}`);
+      }
+    } catch (error) {
+      toast.error("Failed to suggest category");
+    }
+  };
+
   return (
     <div>
       <EmojiPickerPopup
@@ -11,6 +23,30 @@ const AddExpenseForm = ({onAddExpense}) => {
         onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
       />
 
+      <Input
+        value={income.description}
+        onChange={({ target }) => handleChange("description", target.value)}
+        label="Description (Optional)"
+        placeholder="e.g., Lunch at cafe, Train ticket, etc"
+        type="text"
+      />
+
+      {income.description && (
+        <button
+          type="button"
+          onClick={handleSuggestCategory}
+          disabled={categorizing}
+          className="mb-3 flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
+        >
+          {categorizing ? (
+            <> <span>✨</span> Suggest Category </>
+          ) : (
+            <> <span>✨</span> Suggest Category </>
+          )}
+        </button>
+      )}
+
       <Input
         value={income.category}
         onChange={({ target }) => handleChange("category", target.value)}
```

---

## File: frontend/src/pages/Dashboard/Expense.jsx

### Changes Made:
- Added AIMonthlySummary import
- Added state for AI Summary modal
- Added header with AI Summary button
- Added AI Summary modal component

```diff
--- a/frontend/src/pages/Dashboard/Expense.jsx
+++ b/frontend/src/pages/Dashboard/Expense.jsx
@@ -12,6 +12,7 @@ import AddExpenseForm from "../../components/Expense/AddExpenseForm";
 import DeleteAlert from "../../components/DeleteAlert";
 import Modal from "../../components/Modal";
+import AIMonthlySummary from "../../components/AI/AIMonthlySummary";
 import toast from "react-hot-toast";
 
 const Expense = () => {
@@ -22,6 +23,7 @@ const Expense = () => {
   const [expenseData, setExpenseData] = useState([]);
   const [loading, setLoading] = useState(false);
 
   const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
+  const [openAISummaryModal, setOpenAISummaryModal] = useState(false);
   const [openDeleteAlert, setOpenDeleteAlert] = useState({
     show: false,
     data: null,
@@ -127,7 +129,21 @@ const Expense = () => {
 
   return (
     <DashboardLayout activeMenu="Expense">
       <div className="my-5 mx-auto">
+        <div className="flex justify-between items-center mb-4">
+          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
+          <button
+            onClick={() => setOpenAISummaryModal(true)}
+            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all hover:shadow-lg"
+          >
+            <span>📊</span>
+            AI Summary
+          </button>
+        </div>
+
         <div className="grid grid-cols-1 gap-6">
           <div className="">
             <ExpenseOverview
@@ -154,6 +170,11 @@ const Expense = () => {
               />
             </Modal>
           </div>
+
+          <AIMonthlySummary
+            isOpen={openAISummaryModal}
+            onClose={() => setOpenAISummaryModal(false)}
+          />
         </div>
       </div>
     </DashboardLayout>
```

---

## New Files Created - Full Code

### File: backend/services/geminiService.js
(See full file in creation section above)

**Key exports**:
- `categorizeExpense(description)` - Auto-categorizes expenses
- `generateMonthlySummary(monthlyData)` - Generates AI summary
- `ALLOWED_CATEGORIES` - Valid category list

### File: backend/controllers/aiController.js
(See full file in creation section above)

**Key exports**:
- `getMonthlySummary(req, res)` - Monthly summary endpoint
- `categorizeExpense(req, res)` - Categorization endpoint

### File: backend/routes/aiRoutes.js
(See full file in creation section above)

**Routes**:
- `GET /monthly-summary` - Get monthly summary
- `POST /categorize` - Categorize expense

### File: frontend/src/hooks/useAI.js
(See full file in creation section above)

**Exports**:
- `useAISummary()` - Hook for monthly summaries
- `useAutoCategory()` - Hook for categorization

### File: frontend/src/components/AI/AIMonthlySummary.jsx
(See full file in creation section above)

**Component**:
- Modal for displaying monthly AI summary
- Category breakdown with visualizations
- AI-generated insights and recommendations

---

## Summary of Changes

### Backend
- **New files**: 3 (service, controller, routes)
- **Modified files**: 2 (server.js, expenseController.js)
- **New dependencies**: 1 (@google/generative-ai)
- **Env variables added**: 1 (GEMINI_API_KEY)

### Frontend
- **New files**: 2 (hook, component)
- **Modified files**: 3 (apiPaths, AddExpenseForm, Expense page)
- **New dependencies**: 0 (uses existing react-hot-toast)
- **Env variables added**: 0 (VITE_API_URL already existed)

### Total Impact
- **Files created**: 5
- **Files modified**: 5
- **Lines of code added**: ~500+ (excluding documentation)
- **New API endpoints**: 2
- **New React components**: 1
- **New custom hooks**: 2
