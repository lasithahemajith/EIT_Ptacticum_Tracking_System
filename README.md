# EIT_Ptacticum_Tracking_System
EIT_Ptacticum_Tracking_System

# Practicum Tracker Backend

## Setup
```bash
npm install
npm run dev

## ❌ 2. Do NOT Push
These contain secrets or system files.

🚫 `.env` (your real one — has passwords)
🚫 `node_modules/`
🚫 `uploads/` (store locally or in S3)
🚫 Database files (`.frm`, `.ibd`, `.db`, `.sql`)
🚫 Any `.pem`, `.crt`, `.key` files

---

## 🗄️ 3. What About Databases?

### 🔹 MySQL
Do **not** push your actual data — instead, export the schema:

```bash
mysqldump -u root -p --no-data practicum > schema.sql


Mongodb has logpapers 

4.  Users

# Prisma Seeding

Run this command to insert the default Super Admin (Tutor):

The credentials are stored in `.env` (`SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD`).

