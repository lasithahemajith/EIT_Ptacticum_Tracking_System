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

-----------------------------------------------------------------------
-----------------------------------------------------------------------

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

🧑‍💻 Local Deployment – Practicum Tracking System (PTS)

The PTS system uses:

🧱 Node.js (Backend)

⚡ Prisma ORM

🗄️ MySQL (Relational Data)

🍃 MongoDB (Logs / Documents)

🖥️ Vite + React (Frontend)

Both databases must be running locally.
---------------------------------------------------

📌 1️⃣ Prerequisites

Install the following:

✅ Node.js (LTS)

https://nodejs.org/

Check:

node -v
npm -v

✅ Git

https://git-scm.com/

Check:

git --version

✅ MySQL

Install MySQL Server.

Start MySQL service and ensure it runs on:

localhost:3306

✅ MongoDB

Install MongoDB Community Edition.

Start MongoDB service.

Default runs on:

mongodb://127.0.0.1:27017

-------------------------------------------
📥 2️⃣ Clone Repository

git clone <repo URL>
cd PTS

-------------------------------------------
🗄️ 3️⃣ Database Setup
🔵 MySQL Setup

Login to MySQL and create database:

CREATE DATABASE practicum;


Make sure MySQL username/password match:

root / root

🟢 MongoDB Setup

MongoDB automatically creates the database when first used.

No manual creation required.

Ensure MongoDB is running:

mongod

--------------------------------------------
🧱 4️⃣ Backend Setup (/be)
Step 1: Navigate to Backend
cd be

Step 2: Install Dependencies
npm install

Step 3: Configure .env

Create .env inside /be with:

PORT=5000
JWT_SECRET=superSecret123

DATABASE_URL=mysql://root:root@localhost:3306/practicum
MONGODB_URI=mongodb://127.0.0.1:27017/practicum

UPLOAD_PATH=uploads/logpapers

SUPERADMIN_EMAIL=admin@eit.ac.nz
SUPERADMIN_PASSWORD=Admin@123


⚠️ Make sure:

MySQL is running

MongoDB is running

practicum database exists in MySQL

---------------------------------------------------
⚙️ 5️⃣ Prisma Setup (MySQL)

PTS uses Prisma for MySQL.

Run:

npx prisma generate
npx prisma migrate dev --name init


This will:

Create all relational tables

Sync schema with MySQL

--------------------------------------------------
👤 6️⃣ Seed Super Admin


npx prisma db seed


This creates:

Email: admin@eit.ac.nz
Password: Admin@123

--------------------------------------------------
▶️ 7️⃣ Run Backend
npm run dev


Backend runs at:

http://localhost:5000


You should see:

Server running on port 5000

-----------------------------------------------------
🖥️ 8️⃣ Frontend Setup (/fe)

Open a new terminal.

Step 1: Navigate
cd fe

Step 2: Install Dependencies
npm install

Step 3: Configure Frontend .env

Create .env inside /fe:

VITE_API_URL=http://localhost:5000

Step 4: Run Frontend
npm run dev


Frontend runs at:

http://localhost:5173


Open in browser.


------------------------------------------------------
📂 Upload Directory Setup

Ensure upload folder exists:

cd be
mkdir -p uploads/logpapers


This is required for:

UPLOAD_PATH=uploads/logpapers

-------------------------
🔐 Default Login
Email: admin@eit.ac.nz
Password: Admin@123

------------------------------------------------------
🧹 Git Hygiene

Do NOT push:

.env
node_modules/
uploads/
.db
.sql
.pem
.crt
.key


Ensure they are inside .gitignore.

-------------------------------------------------------
🚨 Common Issues & Fixes
❌ MySQL Connection Error

✔ Check MySQL is running
✔ Confirm username/password = root/root
✔ Confirm database = practicum

❌ MongoDB Not Connecting

✔ Ensure MongoDB service running
✔ Check port 27017

❌ Prisma Migration Error

Reset database:

npx prisma migrate reset

❌ Port 5000 Already in Use
lsof -i :5000
kill -9 <PID>

-----------------------------------------------------------
-----------------------------------------------------------
✅ Final Local Deployment Checklist

 Node installed

 MySQL running

 MongoDB running

 practicum DB created in MySQL

 .env configured

 Prisma migrated

 Super Admin seeded

 Upload folder created

 Backend running (localhost:5000)

 Frontend running (localhost:5173)
