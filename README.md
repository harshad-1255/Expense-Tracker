# 💰 MERN Expense Tracker

A full-stack expense tracking application built with MongoDB, Express, React, and Node.js. Track your income and expenses with beautiful charts and analytics.

![Expense Tracker](https://img.shields.io/badge/MERN-Stack-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Live Demo

**🔗 [View Live Application](https://expense-tracker-nine-wheat-94.vercel.app)**

**Demo Credentials:**
- Email: `user@user.com`
- Password: `admin`

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 💵 **Income & Expense Tracking** - Add, edit, and delete transactions
- 📊 **Interactive Charts** - Visualize your finances with beautiful charts
- 📈 **Dashboard Analytics** - Overview of your financial status
- 📥 **Export to Excel** - Download your data for analysis
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Built with TailwindCSS
- 😊 **Emoji Support** - Add emojis to categorize transactions

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v7
- TailwindCSS v4
- Recharts (for charts)
- Axios
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret
```

**Backend .env variables:**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Setup Frontend
```bash
cd frontend/expense-tracker
npm install

# Create .env file
cp .env.example .env
```

**Frontend .env variables:**
```env
VITE_API_URL=http://localhost:8000
```

### 4. Run the Application

**Start Backend (from backend folder):**
```bash
npm run dev
```

**Start Frontend (from frontend/expense-tracker folder):**
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 📁 Project Structure

```
mern_expense_tracker_app_23022025/
├── backend/
│   ├── config/          # Database & seeding
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── uploads/         # User uploaded files
│   └── server.js        # Entry point
│
└── frontend/
    └── expense-tracker/
        ├── src/
        │   ├── components/  # Reusable components
        │   ├── pages/       # Page components
        │   ├── context/     # React context
        │   ├── hooks/       # Custom hooks
        │   └── utils/       # Helper functions
        └── public/          # Static assets
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/getUser` - Get user info

### Income
- `POST /api/v1/income/add` - Add income
- `GET /api/v1/income/get` - Get all income
- `DELETE /api/v1/income/:id` - Delete income
- `GET /api/v1/income/downloadexcel` - Download Excel

### Expenses
- `POST /api/v1/expense/add` - Add expense
- `GET /api/v1/expense/get` - Get all expenses
- `DELETE /api/v1/expense/:id` - Delete expense
- `GET /api/v1/expense/downloadexcel` - Download Excel

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard data

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

**Quick Summary:**
1. Deploy database to **MongoDB Atlas** (free)
2. Deploy backend to **Render** or **Vercel** (free)
3. Deploy frontend to **Vercel** (free)

## 📸 Screenshots

_(Add screenshots of your application here)_

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Harshad Kadam**
- GitHub: [@harshad-1255](https://github.com/harshad-1255)
- LinkedIn: [Harshad Kadam](https://linkedin.com/in/yourprofile)
- Live Demo: [Expense Tracker](https://expense-tracker-nine-wheat-94.vercel.app)

## 🙏 Acknowledgments

- Charts powered by [Recharts](https://recharts.org/)
- UI components styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)

---

⭐ Star this repo if you found it helpful!
