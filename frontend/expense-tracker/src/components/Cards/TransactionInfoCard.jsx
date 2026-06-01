import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";

// Category-based icon mapping for better visual distinction
const getCategoryIcon = (category) => {
  // Using emoji for consistent cross-platform display
  const iconMap = {
    // Expense categories
    Food: "🍔",
    Travel: "✈️",
    Rent: "🏠",
    Groceries: "🛒",
    Entertainment: "🎬",
    Shopping: "🛍️",
    Utilities: "⚡",
    Healthcare: "💊",
    "Mobile Recharge": "📱",
    Coffee: "☕",
    // Income sources
    Salary: "💼",
    Freelance: "💻",
    Investment: "📈",
    Bonus: "🎁",
    "Side Project": "🏆",
  };
  return iconMap[category] || "💰";
};

const TransactionInfoCard = ({
  icon,
  title,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete
}) => {
  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  // Helper function to check if string is an emoji or short unicode character
  const isEmoji = (str) => {
    if (!str) return false;
    // Emojis and unicode characters are typically 1-2 characters or non-URL strings
    return str.length <= 2 || !str.startsWith("http");
  };

  const renderIcon = () => {
    // If icon is an emoji, display it
    if (icon && isEmoji(icon)) {
      return <span>{icon}</span>;
    }
    // If icon is a URL, try to load as image
    if (icon && icon.startsWith("http")) {
      return (
        <img 
          src={icon} 
          alt={title} 
          className="w-6 h-6 object-cover" 
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      );
    }
    // Fallback to category-based emoji
    return <span>{getCategoryIcon(title)}</span>;
  };

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
      <div className="w-12 h-12 flex items-center justify-center text-2xl bg-gray-100 rounded-full">
        {renderIcon()}
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 font-medium">{title}</p>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>

        <div className="flex items-center gap-2">
          {!hideDeleteBtn && (
            <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={onDelete}>
              <LuTrash2 size={18} />
            </button>
          )}

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
          >
            <h6 className="text-xs font-medium">
              {type === "income" ? "+" : "-"} ₹{amount}
            </h6>
            {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
