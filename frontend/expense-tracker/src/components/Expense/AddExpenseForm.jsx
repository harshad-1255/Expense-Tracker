import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { useAutoCategory } from "../../hooks/useAI";
import toast from "react-hot-toast";

const AddExpenseForm = ({onAddExpense}) => {
  const [income, setIncome] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
    icon: "",
  });

  const { loading: categorizing, categorizeDescription } = useAutoCategory();

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  const handleSuggestCategory = async () => {
    if (!income.description.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    try {
      const suggestedCategory = await categorizeDescription(income.description);
      if (suggestedCategory) {
        handleChange("category", suggestedCategory);
        toast.success(`Category suggested: ${suggestedCategory}`);
      }
    } catch (error) {
      toast.error("Failed to suggest category");
    }
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={income.description}
        onChange={({ target }) => handleChange("description", target.value)}
        label="Description (Optional)"
        placeholder="e.g., Lunch at cafe, Train ticket, etc"
        type="text"
      />

      {income.description && (
        <button
          type="button"
          onClick={handleSuggestCategory}
          disabled={categorizing}
          className="mb-3 flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
        >
          {categorizing ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Suggesting...
            </>
          ) : (
            <>
              <span>✨</span>
              Suggest Category
            </>
          )}
        </button>
      )}

      <Input
        value={income.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={()=>onAddExpense(income)}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
