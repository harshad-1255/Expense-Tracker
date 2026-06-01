// NVIDIA API Configuration with detailed logging
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_API_URL = "https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions";
const MODEL = "nvidia-llama2";

/**
 * Call NVIDIA API with comprehensive logging for debugging
 * @param {string} prompt - Prompt text
 * @returns {Promise<string>} - Response text
 */
async function callNvidiaAPI(prompt) {
  // === LOG 1: Environment & Configuration ===
  console.log("\n=== NVIDIA API CALL DEBUG ===");
  console.log("✓ NVIDIA_API_KEY loaded:", !!NVIDIA_API_KEY);
  console.log("✓ Key length:", NVIDIA_API_KEY ? NVIDIA_API_KEY.length : 0);
  console.log("✓ Key format:", NVIDIA_API_KEY ? NVIDIA_API_KEY.substring(0, 10) + "..." : "MISSING");
  
  if (!NVIDIA_API_KEY) {
    throw new Error("NVIDIA API key not configured");
  }

  // === LOG 2: Request Configuration ===
  // NVIDIA provides OpenAI-compatible API endpoint
  const url = "https://integrate.api.nvidia.com/v1/chat/completions";
  
  const requestHeaders = {
    "Authorization": `Bearer ${NVIDIA_API_KEY}`,
    "Content-Type": "application/json",
  };
  
  const requestBody = {
    model: "meta/llama2-70b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 500,
  };
  
  console.log("✓ Request URL:", url);
  console.log("✓ Request headers:", {
    "Authorization": "Bearer ***KEY***",
    "Content-Type": "application/json",
  });
  console.log("✓ Request body:", JSON.stringify(requestBody, null, 2));

  // === LOG 3: Make the request ===
  console.log("✓ Sending request to NVIDIA...");
  
  const response = await fetch(url, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(requestBody),
  });

  // === LOG 4: Response status ===
  console.log("✓ Response status:", response.status);
  console.log("✓ Response headers:", {
    "content-type": response.headers.get("content-type"),
  });

  // === LOG 5: Response body ===
  const responseText = await response.text();
  console.log("✓ Response body (raw):", responseText);

  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error("✗ Failed to parse response as JSON");
    throw new Error(`NVIDIA API returned non-JSON response (${response.status}): ${responseText}`);
  }

  console.log("✓ Response data (parsed):", JSON.stringify(responseData, null, 2));

  // === LOG 6: Error handling ===
  if (!response.ok) {
    console.error("✗ API Error:");
    console.error("  Status:", response.status);
    console.error("  Error object:", responseData.error || responseData);
    throw new Error(
      `NVIDIA API Error (${response.status}): ${
        responseData.error?.message || JSON.stringify(responseData)
      }`
    );
  }

  // === LOG 7: Success ===
  // Handle NVIDIA response format
  let result;
  if (responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
    result = responseData.choices[0].message.content;
  } else if (responseData.result) {
    result = responseData.result;
  } else {
    console.error("✗ Invalid response structure:");
    console.error("  Response:", responseData);
    throw new Error("Invalid response from NVIDIA API - unexpected structure");
  }

  console.log("✓ Final result:", result);
  console.log("=== END DEBUG ===\n");

  return result;
}

// Keywords for each category
const categoryKeywords = {
  Food: [
    "restaurant",
    "food",
    "lunch",
    "dinner",
    "breakfast",
    "pizza",
    "burger",
    "meal",
    "cafe",
    "coffee",
    "snacks",
    "grocery",
    "supermarket",
    "baker",
    "bakery",
    "milk",
    "bread",
  ],
  Transport: [
    "uber",
    "taxi",
    "bus",
    "train",
    "flight",
    "petrol",
    "fuel",
    "parking",
    "gas",
    "car",
    "auto",
    "metro",
  ],
  Entertainment: [
    "movie",
    "cinema",
    "game",
    "music",
    "concert",
    "play",
    "ticket",
    "sports",
    "club",
    "bar",
    "recreation",
  ],
  Shopping: [
    "mall",
    "store",
    "shop",
    "clothes",
    "shoes",
    "shopping",
    "retail",
    "amazon",
    "flipkart",
    "brand",
  ],
  Health: [
    "doctor",
    "hospital",
    "medicine",
    "pharmacy",
    "health",
    "gym",
    "fitness",
    "clinic",
    "medical",
    "vaccine",
    "dental",
  ],
  Education: [
    "school",
    "university",
    "college",
    "course",
    "tuition",
    "book",
    "exam",
    "learning",
    "education",
    "training",
  ],
  Bills: [
    "electricity",
    "water",
    "internet",
    "phone",
    "rent",
    "mortgage",
    "insurance",
    "utility",
    "bill",
    "subscription",
  ],
};

const ALLOWED_CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Bills",
  "Other",
];

/**
 * Categorize expense using keyword matching first, then AI fallback
 * @param {string} description - Expense description
 * @returns {Promise<string>} - Category name
 */
async function categorizeExpense(description) {
  if (!description || typeof description !== "string") {
    return "Other";
  }

  const lowerDesc = description.toLowerCase();

  // Try keyword matching first
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
  }

  // Fallback to NVIDIA API
  try {
    if (!NVIDIA_API_KEY) {
      console.warn("NVIDIA API key not configured, using default category");
      return "Other";
    }

    const prompt = `Categorize this expense into ONE of these categories: ${ALLOWED_CATEGORIES.join(
      ", "
    )}. 

Expense description: "${description}"

Respond with ONLY the category name, nothing else.`;

    const result = await callNvidiaAPI(prompt);
    let category = result.trim();

    // Validate response
    if (!ALLOWED_CATEGORIES.includes(category)) {
      category = "Other";
    }

    return category;
  } catch (error) {
    console.error("NVIDIA categorization error:", error.message);
    return "Other";
  }
}

/**
 * Generate local spending insights as fallback
 */
function generateLocalInsights(totalSpent, categoryBreakdown, previousMonthTotal) {
  const sortedCategories = Object.entries(categoryBreakdown || {})
    .sort(([, a], [, b]) => b - a);

  // Handle empty categoryBreakdown
  if (sortedCategories.length === 0) {
    return {
      mainInsight: "No expenses recorded this month. You're off to a great start with spending discipline!",
      keyTakeaways: [
        "Keep up the excellent expense tracking habit",
        "Set monthly spending goals as your baseline grows",
      ],
      potentialSavings: "Start logging expenses to identify spending patterns.",
      biggestCategory: null,
      spendingTrend: "No data",
    };
  }

  const topCategory = sortedCategories[0];
  const topCategoryPercent = totalSpent > 0 ? ((topCategory[1] / totalSpent) * 100).toFixed(1) : 0;

  let spendingTrend = "";
  let trendPercentage = 0;
  let isIncrease = false;

  if (previousMonthTotal && totalSpent > previousMonthTotal) {
    trendPercentage = (((totalSpent - previousMonthTotal) / previousMonthTotal) * 100).toFixed(1);
    spendingTrend = `increased by ${trendPercentage}%`;
    isIncrease = true;
  } else if (previousMonthTotal && totalSpent < previousMonthTotal) {
    trendPercentage = (((previousMonthTotal - totalSpent) / previousMonthTotal) * 100).toFixed(1);
    spendingTrend = `decreased by ${trendPercentage}%`;
    isIncrease = false;
  } else {
    spendingTrend = "stable";
  }

  // Generate key takeaways
  const keyTakeaways = [];

  if (spendingTrend !== "stable") {
    keyTakeaways.push(
      `Your spending ${spendingTrend} compared to last month.`
    );
  } else if (previousMonthTotal) {
    keyTakeaways.push(`Your spending remained consistent with last month.`);
  }

  keyTakeaways.push(
    `${topCategory[0]} is your top category at ${topCategoryPercent}% of expenses.`
  );

  // Find a positive habit if exists
  const essentialCategories = ["Groceries", "Food", "Rent", "Utilities"];
  const essentialSpent = Object.entries(categoryBreakdown)
    .filter(([cat]) => essentialCategories.includes(cat))
    .reduce((sum, [, amount]) => sum + amount, 0);

  if (essentialSpent > totalSpent * 0.6) {
    keyTakeaways.push(
      `Good habit: ${((essentialSpent / totalSpent) * 100).toFixed(0)}% of spending is on essentials.`
    );
  } else if (sortedCategories.length > 0) {
    keyTakeaways.push(
      `Consider reviewing discretionary spending categories.`
    );
  }

  // Calculate potential savings
  let potentialSavings = "";
  const topCategoryAmount = topCategory[1];
  const savingsPercent = topCategoryPercent > 30 ? 15 : 10;
  const potentialSavingsAmount = Math.round((topCategoryAmount * savingsPercent) / 100);

  if (topCategory[0]) {
    potentialSavings = `Reducing ${topCategory[0]} by ${savingsPercent}% could save approximately ₹${potentialSavingsAmount} per month.`;
  }

  // Main insight (concise, 1-2 sentences)
  let mainInsight = `You spent ₹${totalSpent} this month.`;
  if (spendingTrend && spendingTrend !== "stable") {
    mainInsight += ` That's a ${spendingTrend}.`;
  }
  if (topCategoryPercent > 30) {
    mainInsight += ` Most of it went to ${topCategory[0]}.`;
  }

  return {
    mainInsight,
    keyTakeaways: keyTakeaways.slice(0, 3), // Max 3 takeaways
    potentialSavings,
    biggestCategory: {
      name: topCategory[0],
      amount: topCategory[1],
      percentage: topCategoryPercent,
    },
    spendingTrend: spendingTrend,
    totalSpent,
  };
}

/**
 * Generate monthly spending summary using NVIDIA or local analysis
 * @param {Object} monthlyData - Aggregated monthly data
 * @param {number} monthlyData.totalSpent - Total spent in the month
 * @param {Object} monthlyData.categoryBreakdown - Category-wise breakdown
 * @returns {Promise<Object>} - Summary with insights
 */
async function generateMonthlySummary(monthlyData) {
  try {
    const { totalSpent, categoryBreakdown, previousMonthTotal } = monthlyData;

    // Try NVIDIA API first if key is available
    if (NVIDIA_API_KEY) {
      try {
        const categoryStats = Object.entries(categoryBreakdown)
          .map(([cat, amount]) => `${cat}: ₹${amount}`)
          .join("\n");

        const prompt = `You are a financial advisor. Provide ONLY a JSON response with this exact structure:
{
  "mainInsight": "Brief 1-2 sentence summary of their spending",
  "keyTakeaways": ["insight 1", "insight 2", "insight 3"],
  "potentialSavings": "Specific actionable saving opportunity"
}

Monthly Expense Data:
- Total Spent: ₹${totalSpent}
- Category Breakdown:
${categoryStats}
${previousMonthTotal ? `- Previous Month Total: ₹${previousMonthTotal}` : ""}

Focus on insights, not repeating data already visible.`;

        const summaryText = await callNvidiaAPI(prompt);
        
        // Try to parse as JSON
        try {
          const parsed = JSON.parse(summaryText);
          return {
            success: true,
            summary: parsed,
            generatedAt: new Date(),
            method: "ai_generated",
          };
        } catch (e) {
          // If not valid JSON, use local analysis
          console.warn("AI response not in expected format, using local analysis");
          throw new Error("Invalid AI response format");
        }
      } catch (apiError) {
        console.warn("NVIDIA API failed, using local analysis:", apiError.message);
        // Fall through to local analysis
      }
    }

    // Use local insights as fallback
    const localSummary = generateLocalInsights(totalSpent, categoryBreakdown, previousMonthTotal);
    
    return {
      success: true,
      summary: localSummary,
      generatedAt: new Date(),
      method: "local_analysis", // Indicate that this is local analysis, not AI-generated
    };
  } catch (error) {
    console.error("Summary generation error:", error.message);
    throw error;
  }
}

module.exports = {
  categorizeExpense,
  generateMonthlySummary,
  ALLOWED_CATEGORIES,
};
