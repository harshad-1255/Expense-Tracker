import React, { useState } from "react";
import { useAISummary } from "../../hooks/useAI";
import Modal from "../Modal";
import toast from "react-hot-toast";

const AIMonthlySummary = ({ isOpen, onClose }) => {
  const { loading, error, summary, generateSummary } = useAISummary();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      await generateSummary();
      if (!error) {
        toast.success("Summary generated successfully!");
      }
    } catch (err) {
      toast.error(error || "Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to determine icon based on spending trend
  const getTrendIcon = (trend) => {
    if (trend.includes("decreased")) return "📉";
    if (trend.includes("increased")) return "📈";
    return "➡️";
  };

  // Helper function to get category emoji
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      Food: "🍔",
      Travel: "🚕",
      Rent: "🏠",
      Groceries: "🛒",
      Entertainment: "🎬",
      Shopping: "🛍️",
      Utilities: "⚡",
      Healthcare: "🏥",
      "Mobile Recharge": "📱",
      Coffee: "☕",
    };
    return emojiMap[category] || "💰";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📊 AI Monthly Summary">
      <div className="space-y-4 max-h-[80vh] overflow-y-auto">
        {!summary ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Get Your Financial Insights
              </h3>
              <p className="text-gray-600">
                Let AI analyze your spending and provide personalized advice.
              </p>
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={loading || isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {loading || isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span> Generate Summary
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header Section - Main Insight */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💰</div>
                <div className="flex-1">
                  <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wide">
                    Monthly Overview
                  </p>
                  <p className="text-lg font-semibold leading-relaxed">
                    {summary.summary?.mainInsight ||
                      "Your spending summary is ready."}
                  </p>
                </div>
              </div>
            </div>

            {/* Biggest Category Card */}
            {summary.summary?.biggestCategory && (
              <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-lg">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3">
                  Biggest Spending Category
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {getCategoryEmoji(summary.summary.biggestCategory.name)}
                    </span>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {summary.summary.biggestCategory.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{summary.summary.biggestCategory.amount.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold text-lg">
                    {summary.summary.biggestCategory.percentage}%
                  </div>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        summary.summary.biggestCategory.percentage,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Key Takeaways Section */}
            {summary.summary?.keyTakeaways &&
              summary.summary.keyTakeaways.length > 0 && (
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span>🎯</span> Key Takeaways
                  </p>
                  <ul className="space-y-2">
                    {summary.summary.keyTakeaways.map((takeaway, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-gray-700 text-sm leading-relaxed"
                      >
                        <span className="text-indigo-600 font-bold min-w-fit">
                          ✓
                        </span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Potential Savings Section */}
            {summary.summary?.potentialSavings && (
              <div className="bg-green-50 border-2 border-green-200 p-5 rounded-lg">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span>💚</span> Potential Savings
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎯</div>
                  <p className="text-gray-700 font-medium">
                    {summary.summary.potentialSavings}
                  </p>
                </div>
              </div>
            )}

            {/* Monthly Comparison - if previous month exists */}
            {summary.data?.previousMonthTotal && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">
                  Month-to-Month Comparison
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600 font-medium mb-1">
                      This Month
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{summary.data.totalSpent.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium mb-1">
                      Last Month
                    </p>
                    <p className="text-2xl font-bold text-gray-600">
                      ₹{summary.data.previousMonthTotal.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {summary.data?.categoryBreakdown &&
              Object.keys(summary.data.categoryBreakdown).length > 0 && (
                <div className="bg-white border border-gray-200 p-5 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-4">
                    Category Breakdown
                  </p>
                  <div className="space-y-3">
                    {Object.entries(summary.data.categoryBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount]) => {
                        const percentage = (
                          (amount / summary.data.totalSpent) *
                          100
                        ).toFixed(1);
                        return (
                          <div key={category}>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {getCategoryEmoji(category)}
                                </span>
                                <span className="text-sm font-medium text-gray-700">
                                  {category}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-gray-800">
                                ₹{amount.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {percentage}%
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            {/* Generated At Timestamp */}
            <p className="text-xs text-gray-500 text-center">
              Generated on{" "}
              {new Date(summary.generatedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {/* Regenerate Button */}
            <button
              onClick={handleGenerateSummary}
              disabled={loading || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-4 flex items-center justify-center gap-2"
            >
              {loading || isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Regenerating...
                </>
              ) : (
                <>
                  <span>🔄</span> Regenerate Summary
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 text-red-700 text-sm">
            <p className="font-semibold mb-1">⚠️ Error</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIMonthlySummary;
