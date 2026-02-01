# 🚀 Deployment Guide - MERN Expense Tracker

This guide will help you deploy your expense tracker app to production.

## 📋 Prerequisites

1. GitHub account
2. MongoDB Atlas account (free)
3. Vercel account (free)
4. Render account (free) - OR use Vercel for backend too

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and sign in
3. Create a new cluster (M0 Free tier)
4. Go to **Database Access** → Add New Database User
   - Username: `expense_tracker_admin`
   - Password: Generate secure password
   - **Save this password!**
5. Go to **Network Access** → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Render/Vercel to connect
6. Go to **Database** → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://...mongodb.net/expense_tracker?retryWrites=true&w=majority`

---

## 🔧 Step 2: Deploy Backend (Choose ONE option)

### Option A: Deploy Backend to Render (Recommended - Better for Node.js)

1. Go to [Render](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `expense-tracker-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables (click "Advanced"):
   ```
   MONGO_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<random_string_like_abc123xyz456>
   CLIENT_URL=*
   NODE_ENV=productiondel
   PORT=5000
   ```
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. **Copy your backend URL**: `https://expense-tracker-backend-xxxx.onrender.com`

⚠️ **Important**: Free Render services sleep after 15 minutes of inactivity. First request may take 30-60 seconds.

### Option B: Deploy Backend to Vercel

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Add Environment Variables:
   ```
   MONGO_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<random_string_like_abc123xyz456>
   CLIENT_URL=*
   NODE_ENV=production
   ```
6. Click "Deploy"
7. **Copy your backend URL**: `https://expense-tracker-backend-xxxx.vercel.app`

---

## 🎨 Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository (if not already)
4. Configure:
   - **Root Directory**: `frontend/expense-tracker`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=<your_backend_url_from_step_2>
   ```
   Example: `VITE_API_URL=https://expense-tracker-backend-xxxx.onrender.com`
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. **Your app is live!** 🎉

Your frontend URL will be: `https://expense-tracker-xxxx.vercel.app`

---

## 🔄 Step 4: Update Backend CORS

After deploying frontend, update your backend environment variables:

1. Go to Render/Vercel backend dashboard
2. Update `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://expense-tracker-xxxx.vercel.app
   ```
3. Redeploy if necessary

---

## ✅ Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try signing up / logging in
3. Test adding expenses and income
4. Verify all features work

---

## 🎯 What to Put on Your Resume

```
🔗 Live Demo: https://expense-tracker-xxxx.vercel.app
📂 GitHub: https://github.com/yourusername/expense-tracker
```

Add this to your project description:
- "Deployed full-stack MERN application using Vercel (frontend), Render (backend), and MongoDB Atlas (database)"
- "Configured CI/CD pipeline for automatic deployments from GitHub"

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel environment variables
- Make sure backend URL doesn't have trailing slash
- Check browser console for CORS errors

### Backend errors
- Verify MongoDB connection string is correct
- Check all environment variables are set
- Look at logs in Render/Vercel dashboard

### 500 Internal Server Error
- Check backend logs
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Render service sleeping
- This is normal on free tier
- First request after 15 min inactivity takes 30-60 seconds
- Consider upgrading to paid tier ($7/month) for always-on service

---

## 🔄 Making Updates

Every time you push to GitHub:
- Vercel automatically redeploys frontend
- Render automatically redeploys backend

No manual deployment needed! 🚀

---

## 💡 Tips

1. **Custom Domain**: Both Vercel and Render allow custom domains on free tier
2. **Environment Variables**: Never commit `.env` files to GitHub
3. **Demo Account**: Your app already seeds a demo user for recruiters
4. **Monitoring**: Check Render/Vercel dashboards for logs and errors
5. **Cost**: Everything is FREE for portfolio projects!

---

## 📱 Bonus: Add to Portfolio

Create a project card:
```markdown
### 💰 Expense Tracker
Full-stack MERN application for managing personal finances

**Tech Stack**: React, Node.js, Express, MongoDB, TailwindCSS, Recharts

**Features**:
- User authentication with JWT
- Income & expense tracking
- Interactive charts and analytics
- Export data to Excel
- Responsive design

[🔗 Live Demo](https://your-app.vercel.app) | [📂 Code](https://github.com/your-repo)
```

---

## 🎉 You're Done!

Your app is now live and ready to share with recruiters!

Need help? Check the logs in Render/Vercel dashboards.
