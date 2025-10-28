# 🎓 EIT Practicum Tracking System

A full-stack web application designed to streamline practicum tracking, feedback management, and performance evaluation for students, mentors, and tutors at the Eastern Institute of Technology (EIT).

---

## 🧭 Overview

This system helps EIT’s School of Computing manage practicum activities for Mental Health & Addiction students.  
It allows students to log practicum hours, mentors to verify logs and provide feedback, and tutors to monitor overall student progress — all in one central dashboard.

---

## 🧩 Project Structure


EIT_Pratictum_Tracking_System/
├── backend/ # Node.js + Express + Prisma + MySQL + MongoDB
│ ├── prisma/ # Prisma schema & migrations
│ ├── src/
│ │ ├── routes/ # API endpoints
│ │ ├── controllers/ # Business logic
│ │ ├── middlewares/ # Auth, error handlers
│ │ └── server.js # Main Express entry point
│ └── package.json
│
├── frontend/ # React + Vite + Redux Toolkit + TailwindCSS
│ ├── src/
│ │ ├── api/ # Axios setup & interceptors
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # Auth context (Tutor / Mentor / Student)
│ │ ├── pages/ # All main pages
│ │ └── App.jsx # Root app
│ └── package.json
│
└── README.md


---

## ⚙️ Tech Stack

### Backend
- **Node.js + Express.js**
- **Prisma ORM** with **MySQL**
- **MongoDB** for log papers & feedback
- **JWT Authentication**
- **bcrypt** for password hashing
- **dotenv**, **multer**

### Frontend
- **React + Vite**
- **Redux Toolkit**
- **TailwindCSS**
- **Framer Motion**
- **Axios**
- **React Router v6**

---

## 🧠 Core Features

| Role | Features |
|------|-----------|
| **Student** | Submit practicum logs, view feedback, track hours |
| **Mentor** | Review logs, verify and comment, approve/reject |
| **Tutor (Super Admin)** | Manage users, assign mentors, view overall reports |

----------------------------------------------
----------------------------------------------

## 🧱 Backend Setup (`/backend`)

### 1️⃣ Install Dependencies
```bash
cd be
npm install

2️⃣ Configure .env
refer .env.example


-------------------------------------------
3️⃣ Prisma Setup
npx prisma generate
npx prisma migrate dev --name init

--------------

4️⃣ Seed Super Admin
npm run seed

Creates the default Tutor (Super Admin) using .env credentials.
5️⃣ Run Development Server
npm run dev


✅ Server runs at: http://localhost:5000

--------------------------------------------------
--------------------------------------------------

🖥️ Frontend Setup (/frontend)

1️⃣ Install Dependencies
cd fe
npm install

2️⃣ Configure .env

Create .env in /frontend: ( crrently in axios)

VITE_API_URL=http://localhost:5000

3️⃣ Run Development Server
npm run dev


✅ Runs at: http://localhost:5173

-----------------------------------------
-----------------------------------------
🧹 Git Hygiene

Do NOT push these files or folders:

🚫 .env (secrets)
🚫 node_modules/
🚫 uploads/
🚫 .pem, .crt, .key files
🚫 .db, .sql, .ibd, .frm files