# AI Features Implementation Guide

## Overview
This document provides complete implementation details for two AI features integrated into the Expense Tracker application using Google Gemini API:
1. **Automatic Expense Categorization** - Keyword-based with AI fallback
2. **AI Monthly Summary** - Intelligent spending analysis and recommendations

---

## Files Created

### 1. Backend Service: `backend/services/geminiService.js`
**Purpose**: Core service for Gemini API integration
- **Exports**:
  - `categorizeExpense(description)` - Auto-categorize expenses using keywords first, then AI fallback
  - `generateMonthlySummary(monthlyData)` - Generate AI-powered spending insights
  - `ALLOWED_CATEGORIES` - Array of valid categories: Food, Transport, Entertainment, Shopping, Health, Education, Bills, Other

**Key Features**:
- Keyword-based categorization with 40+ curated keywords per category
- Graceful fallback to Gemini API if keywords don't match
- Error handling with "Other" category fallback
- Monthly data aggregation and analysis
- Comparison with previous month's spending

### 2. Backend Controller: `backend/controllers/aiController.js`
**Purpose**: Handle AI-related API requests
- **Endpoints**:
  - `GET /api/v1/ai/monthly-summary` - Generate monthly spending summary
  - `POST /api/v1/ai/categorize` - Suggest category for expense description

**Functions**:
- `getMonthlySummary(req, res)` - Fetches current month data, calculates totals, generates AI summary
- `categorizeExpense(req, res)` - Takes description, returns suggested category

### 3. Backend Routes: `backend/routes/aiRoutes.js`
**Purpose**: Define AI feature routes
- Protected with JWT authentication middleware
- Routes to AI controller functions

### 4. Frontend Hook: `frontend/src/hooks/useAI.js`
**Purpose**: Custom React hooks for AI features
- **Exports**:
  - `useAISummary()` - Hook for generating monthly summaries
    - Returns: `{ loading, error, summary, generateSummary }`
  - `useAutoCategory()` - Hook for auto-categorizing descriptions
    - Returns: `{ loading, error, categorizeDescription }`

### 5. Frontend Component: `frontend/src/components/AI/AIMonthlySummary.jsx`
**Purpose**: UI component for displaying AI monthly summary
- **Features**:
  - Generate Summary button with loading state
  - Display monthly totals and category breakdown
  - Visual progress bars for spending by category
  - AI-generated insights and saving suggestions
  - Regenerate button for refreshing summary
  - Error state display
  - Responsive design with Tailwind CSS

---

## Files Modified

### 1. `backend/server.js`
**Changes**:
- Added import: `const aiRoutes = require("./routes/aiRoutes");`
- Added route: `app.use("/api/v1/ai", aiRoutes);`

### 2. `backend/controllers/expenseController.js`
**Changes**:
- Added import: `const { categorizeExpense } = require("../services/geminiService");`
- Modified `addExpense()` function:
  - Made category optional if description is provided
  - Auto-categorizes when description is provided but category is not
  - Maintains backward compatibility with existing code

### 3. `backend/.env`
**Changes**:
- Added: `GEMINI_API_KEY=your_gemini_api_key_here`

### 4. `frontend/src/utils/apiPaths.js`
**Changes**:
- Added new AI section to API_PATHS:
  ```javascript
  AI: {
    MONTHLY_SUMMARY: "/api/v1/ai/monthly-summary",
    CATEGORIZE_EXPENSE: "/api/v1/ai/categorize",
  }
  ```

### 5. `frontend/src/components/Expense/AddExpenseForm.jsx`
**Changes**:
- Added description field for expense description
- Integrated `useAutoCategory()` hook
- Added "Suggest Category" button
  - Calls AI to suggest category based on description
  - Displays loading spinner while generating
  - Auto-fills category field with suggestion
- Updated form state to include `description`
- Maintains all existing functionality

### 6. `frontend/src/pages/Dashboard/Expense.jsx`
**Changes**:
- Added import: `import AIMonthlySummary from "../../components/AI/AIMonthlySummary";`
- Added state: `const [openAISummaryModal, setOpenAISummaryModal] = useState(false);`
- Added header with:
  - Page title "Expenses"
  - "📊 AI Summary" button that opens the modal
- Added modal component:
  ```javascript
  <AIMonthlySummary
    isOpen={openAISummaryModal}
    onClose={() => setOpenAISummaryModal(false)}
  />
  ```

---

## Setup Instructions

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally at `mongodb://localhost:27017`
- Google Gemini API key (from Google AI Studio)

### Step 1: Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key (if you don't have one)
4. Copy the API key

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
# @google/generative-ai package was already added
```

### Step 3: Configure Environment Variables

**Backend** (.env file location: `backend/.env`):
```
MONGO_URI=mongodb://localhost:27017/expense-tracker
PORT=5001
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Replace `your_actual_gemini_api_key_here` with the API key from Step 1.

**Frontend** (.env.local file location: `frontend/expense-tracker/.env.local`):
```
VITE_API_URL=http://localhost:5001
```

### Step 4: Start Services
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend/expense-tracker
npm run dev
```

### Step 5: Verify Setup
1. Open browser to `http://localhost:5173`
2. Log in with demo credentials:
   - Email: `user@user.com`
   - Password: `admin`
3. Navigate to Expenses page
4. Verify:
   - "📊 AI Summary" button appears at top right
   - "Add Expense" form has "Description" field
   - "Suggest Category" button appears when description is entered

---

## Testing Instructions

### Test 1: Auto-Categorization Feature

#### Test 1a: Keyword-Based Categorization
1. Navigate to Expenses page
2. Click "Add Expense"
3. Enter description: "Lunch at McDonalds"
4. Click "Suggest Category"
5. **Expected**: Category auto-fills with "Food"

#### Test 1b: AI Fallback Categorization
1. Navigate to Expenses page
2. Click "Add Expense"
3. Enter description: "Monthly fitness sessions"
4. Click "Suggest Category"
5. **Expected**: Should use AI to suggest "Health" or similar
6. **Note**: Requires valid GEMINI_API_KEY

#### Test 1c: Direct API Category Categorization
```bash
curl -X POST http://localhost:5001/api/v1/ai/categorize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description":"Petrol fill up"}'
```
**Expected Response**:
```json
{
  "success": true,
  "category": "Transport",
  "description": "Petrol fill up"
}
```

### Test 2: Monthly Summary Feature

#### Test 2a: Generate Summary UI
1. Navigate to Expenses page
2. Verify "📊 AI Summary" button is visible (top right)
3. Click "📊 AI Summary"
4. Modal opens with title "📊 AI Monthly Summary"
5. Click "Generate Summary"
6. **Expected**: 
   - Loading spinner displays
   - After ~5 seconds, summary appears with:
     - Current month name
     - Total spent amount
     - Category breakdown with progress bars
     - AI-generated insights
     - Recommendation to regenerate

#### Test 2b: Direct API Summary Call
```bash
curl -X GET http://localhost:5001/api/v1/ai/monthly-summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Expected Response**:
```json
{
  "success": true,
  "month": "May 2026",
  "data": {
    "totalSpent": 27499,
    "categoryBreakdown": {
      "Food": 1100,
      "Transport": 1200,
      "Entertainment": 600,
      "Shopping": 2400,
      "Health": 1500,
      "Bills": 1800,
      "Other": 18899
    },
    "previousMonthTotal": null
  },
  "summary": "Based on your spending...",
  "generatedAt": "2026-05-31T13:34:43.987Z"
}
```

#### Test 2c: Error Handling (Missing API Key)
1. Remove or invalidate GEMINI_API_KEY from `.env`
2. Restart backend
3. Try generating summary
4. **Expected**: Error message "Failed to generate summary"

### Test 3: Adding Expense with Auto-Category

#### Test 3a: Expense with Description
1. Navigate to Expenses page
2. Click "Add Expense"
3. Fill form:
   - Description: "Starbucks coffee"
   - Amount: 300
   - Date: Today
   - Icon: Choose any emoji
4. Click "Suggest Category" → Should auto-fill with "Food"
5. Click "Add Expense"
6. **Expected**: Expense added successfully with auto-suggested category

#### Test 3b: Expense without Description (Legacy)
1. Navigate to Expenses page
2. Click "Add Expense"
3. Fill form (skip Description):
   - Category: "Entertainment" (manual entry)
   - Amount: 500
   - Date: Today
   - Icon: Choose emoji
4. Click "Add Expense"
5. **Expected**: Expense added with manually entered category

### Test 4: Edge Cases

#### Test 4a: Empty Description
1. Click "Add Expense"
2. Leave Description empty
3. Try clicking "Suggest Category"
4. **Expected**: Toast error "Please enter a description first"

#### Test 4b: Invalid Category Response
1. Enter description with ambiguous text: "123456789"
2. Click "Suggest Category"
3. **Expected**: Falls back to "Other" category

#### Test 4c: Network Error
1. Stop backend server
2. Try generating summary or suggesting category
3. **Expected**: Network error toast displayed

#### Test 4d: Concurrent Requests
1. Open Add Expense modal
2. Quickly click "Suggest Category" multiple times
3. **Expected**: Only one request processes (button is disabled during loading)

---

## API Response Examples

### 1. Categorize Expense
**Request**:
```bash
POST /api/v1/ai/categorize
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "description": "Weekly groceries shopping at supermarket"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "category": "Shopping",
  "description": "Weekly groceries shopping at supermarket"
}
```

**Error Response (500)**:
```json
{
  "success": false,
  "message": "Failed to categorize expense",
  "error": "Error details..."
}
```

### 2. Monthly Summary
**Request**:
```bash
GET /api/v1/ai/monthly-summary
Authorization: Bearer TOKEN
```

**Success Response (200)**:
```json
{
  "success": true,
  "month": "May 2026",
  "data": {
    "totalSpent": 27499,
    "categoryBreakdown": {
      "Food": 1100,
      "Transport": 1200,
      "Entertainment": 600,
      "Shopping": 2400,
      "Health": 1500,
      "Bills": 1800,
      "Other": 18899
    },
    "previousMonthTotal": null
  },
  "summary": "Your monthly spending overview...",
  "generatedAt": "2026-05-31T13:34:43.987Z"
}
```

**Error Response (500)**:
```json
{
  "success": false,
  "message": "Failed to generate summary",
  "error": "Gemini API key not configured"
}
```

---

## Allowed Categories

The expense tracker recognizes the following 8 categories:
1. **Food** - Restaurants, groceries, coffee, meals
2. **Transport** - Uber, taxi, bus, flights, gas, parking
3. **Entertainment** - Movies, games, concerts, sports
4. **Shopping** - Clothes, retail, online shopping
5. **Health** - Doctor, medicine, gym, healthcare
6. **Education** - School, courses, books, training
7. **Bills** - Utilities, rent, insurance, subscriptions
8. **Other** - Anything not fitting above categories

---

## Troubleshooting

### Issue: "Gemini API key not configured"
**Solution**: 
1. Verify GEMINI_API_KEY is set in backend/.env
2. Restart backend server
3. Ensure API key is valid (check Google AI Studio)

### Issue: "Failed to generate summary"
**Causes**:
- Invalid/expired Gemini API key
- Network connectivity issues
- No expenses in current month
- Rate limiting from Gemini API

**Solution**:
1. Check API key validity
2. Check network connectivity
3. Try again after a few seconds
4. Check Gemini API quota/limits

### Issue: Category suggestion returns "Other"
**Causes**:
- Description text is too ambiguous
- Keyword list doesn't match description
- Gemini API not configured or failing

**Solution**:
1. Use more specific descriptions (e.g., "Coffee at Starbucks" instead of "drink")
2. Ensure GEMINI_API_KEY is configured
3. Check backend logs for errors

### Issue: Frontend doesn't show AI Summary button
**Causes**:
- Frontend not rebuilt after changes
- API routes not added to server.js
- JavaScript errors in console

**Solution**:
1. Clear browser cache
2. Restart frontend dev server (`npm run dev`)
3. Check browser console for errors
4. Verify server.js has aiRoutes configured

---

## Performance Considerations

1. **API Rate Limiting**: Gemini API has rate limits. Adding delays between requests is recommended for production.
2. **Caching**: Consider caching monthly summaries (refresh once per day)
3. **Aggregation**: Monthly summary fetches all expenses for the month; this is efficient for typical use
4. **Keyword Matching**: O(1) operation per keyword, very fast
5. **AI Fallback**: Only used if no keywords match, reducing API calls

---

## Security Best Practices

1. **API Key Management**:
   - Never commit .env to version control
   - Use environment variables for production
   - Rotate keys periodically

2. **Input Validation**:
   - All descriptions are validated before sending to Gemini
   - Max 500 characters enforced
   - SQL injection prevention via MongoDB/Mongoose

3. **Authentication**:
   - All AI endpoints require JWT authentication
   - User ID extracted from token for data isolation

4. **Rate Limiting** (Recommended for production):
   - Implement rate limiting on AI endpoints
   - Limit categorization calls to 100/minute per user
   - Limit summary generation to 10/day per user

---

## Future Enhancements

1. **Spending Predictions**: Predict next month's spending based on trends
2. **Budget Alerts**: AI-powered alerts when approaching budget limits
3. **Recurring Expense Detection**: Automatically detect and suggest recurring expenses
4. **Smart Tags**: ML-powered automatic tagging beyond categories
5. **Anomaly Detection**: Alert users to unusual spending patterns
6. **Receipt OCR**: Extract expense details from receipt images
7. **Natural Language Queries**: "Show me my food spending this month"
8. **Multi-language Support**: Categorize descriptions in multiple languages

---

## Support & Issues

For issues or questions:
1. Check the Troubleshooting section above
2. Review backend logs: `backend/` console output
3. Check frontend console: Browser DevTools → Console tab
4. Verify all environment variables are set correctly
5. Ensure backend is running on port 5001
6. Ensure frontend is running on port 5173
7. Ensure MongoDB is running and connected

---

## License & Attribution

This AI feature implementation uses:
- **Google Gemini API** for AI functionality
- **MongoDB** for data persistence
- **Express.js** for backend
- **React** for frontend
- **Tailwind CSS** for styling
