# 💰 Expense Tracker Pro

> A production-ready, full-stack **MERN (MongoDB, Express, React, Node.js)** finance management application built with scalable MVC architecture, JWT authentication, real-time savings rate calculations, visual analytics, and responsive dark-mode UI.

![Expense Tracker Pro](https://img.shields.io/badge/Stack-MERN-7c3aed?style=for-the-badge)
![Live Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel)
![Live Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🌟 Key Features

- **🔒 Authentication & Data Isolation**
  - Secure User Registration & Login with `bcryptjs` password hashing.
  - Stateless JWT (JSON Web Tokens) authorization middleware.
  - Multi-tenant data isolation — users only access their own financial records.

- **💳 Complete Expense Management**
  - Full CRUD operations (Create, Read, Update, Delete) for expenses.
  - Instant client-side search and category filtering chips (Food, Transport, Shopping, etc.).
  - Confirmation modals for delete actions.

- **💰 Income Tracking & Net Balance**
  - Full CRUD operations for income streams (Salary, Freelance, Investments, etc.).
  - Automatic computation of **Net Balance** (`Total Income - Total Expenses`).

- **🎯 Live Savings Rate & Dashboard Overview**
  - Real-time **Monthly Savings Rate** calculation: `((Income - Expense) / Income) * 100`.
  - Financial health score indicator.
  - Visual category spending distribution progress bars.

- **📈 Visual Analytics & Reports (`/analytics`)**
  - 6-Month Income vs Expense comparison trend charts.
  - Category distribution breakdowns and financial smart advice cards.

- **🏷️ Categories & Budget Allocation (`/categories`)**
  - Category budget threshold tracking.
  - Visual color-coded alert badges (Green < 75%, Yellow 75-90%, Red > 90%).

- **⚙️ Profile & Data Backup (`/settings`)**
  - User profile management and security password updates.
  - One-click **CSV and JSON data export** for transaction backups.

- **📱 Fully Mobile Responsive**
  - Seamless desktop sidebar navigation and mobile overlay drawer navigation.
  - Adaptive flex & grid layouts across all screen resolutions.

---

## 🏗️ System Architecture

```
                               ┌────────────────────────────────┐
                               │     Vercel Deployed Client     │
                               │  React 19 + Vite + Tailwind    │
                               └──────────────┬─────────────────┘
                                              │ REST API Calls (Axios)
                                              ▼
                               ┌────────────────────────────────┐
                               │     Render Deployed Server     │
                               │   Node.js + Express.js + JWT   │
                               └──────────────┬─────────────────┘
                                              │ Mongoose ORM
                                              ▼
                               ┌────────────────────────────────┐
                               │   MongoDB Atlas Cloud Database │
                               │   Users, Expenses, Incomes     │
                               └────────────────────────────────┘
```

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **Framework**: React 19 (Vite SPA)
- **Styling**: Vanilla CSS Design Tokens + Glassmorphic UI + Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios (Custom instance with Request Interceptor for JWT)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas via Mongoose ODM
- **Authentication**: `jsonwebtoken` (JWT) + `bcryptjs`
- **Security**: Production CORS origin whitelisting

---

## 📡 REST API Endpoints

### 🔐 Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | ❌ |

### 💳 Expense Routes (`/api/expenses`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/expenses` | Fetch logged-in user's expenses | ✅ |
| `POST` | `/api/expenses` | Create a new expense record | ✅ |
| `PUT` | `/api/expenses/:id` | Update an existing expense | ✅ |
| `DELETE` | `/api/expenses/:id` | Delete an expense record | ✅ |

### 💰 Income Routes (`/api/incomes`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/incomes` | Fetch logged-in user's incomes | ✅ |
| `POST` | `/api/incomes` | Create a new income record | ✅ |
| `PUT` | `/api/incomes/:id` | Update an existing income | ✅ |
| `DELETE` | `/api/incomes/:id` | Delete an income record | ✅ |

---

## 🚀 Running Locally

### Prerequisites
- Node.js installed (v18+)
- MongoDB Atlas cluster URL

### 1. Clone the repository
```bash
git clone https://github.com/Bty-Eswar/Expense-Tracker-Project.git
cd Expense-Tracker-Project
```

### 2. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Run the Backend Server
```bash
cd server
npm install
npm dev
```
*Backend will start on `http://localhost:5000`*

### 4. Run the Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend will start on `http://localhost:5173`*

---

## 🌐 Production Deployments

- **Frontend App (Vercel)**: [https://expense-tracker-project-delta-eosin.vercel.app](https://expense-tracker-project-delta-eosin.vercel.app)
- **Backend API (Render)**: [https://expense-tracker-project-2trx.onrender.com](https://expense-tracker-project-2trx.onrender.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).