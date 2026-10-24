# Pulse Fitness Studio 🏋️‍♂️

A full-stack fitness studio web application built with **Next.js (React + Tailwind CSS)**, a real **PostgreSQL database (Neon)**, **Bcrypt password hashing**, and **JWT session authentication**.

---

## 🚀 Live Demo & Repository
- **Live URL**: *(Add your deployed Vercel URL here after deployment)*
- **GitHub**: [github.com/BilalOStack/fitness-studio](https://github.com/BilalOStack/fitness-studio)

---

## 📋 Features

- **Real PostgreSQL Database**: Powered by Neon serverless Postgres with SSL connection pooling.
- **RESTful API Routes**:
  - `GET /api/classes`: Returns class timetable with dynamic category filtering.
  - `GET /api/trainers`: Returns certified trainer profiles.
  - `GET /api/pricing`: Returns membership pricing tiers.
  - `POST /api/bookings`: Authenticated class spot reservation with live database spot decrements.
  - `POST /api/auth/signup`: User registration with password hashing (bcrypt).
  - `POST /api/auth/login`: User authentication with JWT generation and HTTP-only session cookie.
  - `GET /api/auth/me`: Verifies active session token across browser refreshes.
  - `POST /api/auth/logout`: Clears session cookie and logs out user.
- **Persistent Auth State**: Real signup/login sessions that survive page refreshes via JWT stored in HTTP-only cookies and React AuthContext.
- **Controlled UI**: Category filter buttons, dynamic spot quantity stepper, real-time availability badges, and interactive booking modal.
- **Security**: `.env` and `.env.local` strictly excluded from git. Passwords hashed with 10 salt rounds before storage.

---

## 🗄️ Database Schema (Plain English Explanation for Assessment)

Our PostgreSQL database consists of 5 related tables:

1. **`users`**:
   - `id`: Auto-incrementing primary key.
   - `name`: Member's full name.
   - `email`: Unique email address used for login.
   - `password_hash`: Secure bcrypt hash (plain passwords are never stored).
   - `created_at`: Registration timestamp.

2. **`classes`**:
   - `id`: Auto-incrementing primary key.
   - `title`: Name of the class (e.g., *HIIT Blast*, *Power Yoga*).
   - `category`: Workout style (*HIIT*, *Yoga*, *Strength*, *Cycle*, *Boxing*).
   - `time`, `days`, `duration`: Timetable schedule details.
   - `trainer`: Name of assigned coach.
   - `spots_available`: Real-time remaining spots count.
   - `description`, `tag_color`: UI badge formatting and details.

3. **`trainers`**:
   - `id`: Unique slug primary key (e.g., `marcus`, `priya`).
   - `name`, `specialty`, `bio`, `avatar`: Trainer bio and details.

4. **`pricing_plans`**:
   - `id`: Tier identifier (`drop-in`, `unlimited`, `premium`).
   - `name`, `price`, `period`, `featured`, `badge`, `features`, `button_text`: Membership tiers and features.

5. **`bookings`**:
   - `id`: Unique reservation ID.
   - `user_id`: Foreign key pointing to `users(id)`.
   - `class_id`: Foreign key pointing to `classes(id)`.
   - `spots`: Number of spots reserved.
   - `created_at`: Timestamp of reservation.

---

## 🛠️ Step-by-Step Neon Database Setup

1. **Sign Up**: Visit [neon.tech](https://neon.tech) and create a free account with your GitHub or Google account.
2. **Create Project**: Click **Create Project**, name it `fitness-studio`, and click **Create**.
3. **Copy Connection String**:
   - Neon displays your connection string immediately.
   - Copy the string format:
     ```text
     postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
4. **Configure Local Environment**:
   - In `pulse-react/.env.local`, set:
     ```env
     DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
     JWT_SECRET=super-secret-pulsefit-jwt-key-change-in-production-2026
     ```
5. **Seed the Database**:
   - Run the seed script:
     ```bash
     npm run seed
     ```
   - This automatically creates all tables and populates your Week 2 studio data and a demo user (`member@pulsefit.com` / `password123`).

---

## 💻 Running Locally

```bash
# Clone the repository
git clone https://github.com/BilalOStack/fitness-studio.git
cd fitness-studio

# Install dependencies
npm --prefix pulse-react install

# Seed the database (once DATABASE_URL is set in pulse-react/.env.local)
npm run seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel (Going Live)

1. Push your latest code to GitHub:
   ```bash
   git add .
   git commit -m "feat: add Next.js API, Neon Postgres database, and auth"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in with GitHub.
3. Click **Add New...** $\to$ **Project** and select your `fitness-studio` repository.
4. Under **Root Directory**, click **Edit** and select `pulse-react`.
5. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your Neon Postgres connection string.
   - `JWT_SECRET`: A long random string for JWT signing.
6. Click **Deploy**.
7. Once deployed, open your public `.vercel.app` URL and test signing up, logging in, and reserving spots!

---

## 🎓 Assessment Q&A Cheat Sheet

- **Q: Why Next.js?**
  *A: Next.js allows fullstack JavaScript where React UI and serverless API route handlers (`/api/...`) live together cleanly without CORS issues, deploying effortlessly to Vercel.*
- **Q: How does authentication and session persistence work?**
  *A: When a user signs up or logs in, the backend hashes/compares passwords with bcrypt and issues a signed JSON Web Token (JWT) in an HTTP-only cookie and JSON response. On page refresh, the frontend's AuthContext calls `GET /api/auth/me`, which validates the token on the server and restores the user session.*
- **Q: Where is our database hosted and how do we connect?**
  *A: In Neon (Postgres in the cloud). We connect using the `pg` (node-postgres) connection pool over secure SSL (`sslmode=require`).*
- **Q: How are secrets protected?**
  *A: All sensitive credentials (`DATABASE_URL`, `JWT_SECRET`) reside in `.env.local`, which is verified and confirmed excluded by `.gitignore`.*
