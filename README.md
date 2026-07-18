# Acowale CRM Feedback Platform

An enterprise-grade, lightweight customer feedback management platform featuring a public-facing feedback submission portal, an Express REST API backend, and an obfuscated, admin dashboard for analytics and feedback management.

This project is submitted as the first version for **"Acowale CRM Machine Test by Amol"**.

---

## Architecture Overview

This platform is structured as **three independent services** to separate concerns, enforce security boundaries, and prevent client exposure to backend services:

```
Acowale_Machine_Test/
├── frontend/          # Public-Facing Portal (Next.js 16, Port 3000)
├── admin/             # Private Admin Console (Next.js 16, Port 3001)
└── backend/           # Core REST API Service (Node.js & Express, Port 5000)
```

### Key Architectural & Security Decisions

1. **Proxy Routing on Public Portal**: The public frontend uses **Next.js API Route Handlers as a secure proxy**. When a client submits feedback, the browser sends a POST request to `/api/feedback` (same origin). The Next.js server-side handler catches this and forwards the payload to the backend server-side. This keeps `BACKEND_URL` entirely hidden from the browser.
2. **HTTP-Only Secure Cookie Auth**: The administrator authentication is completely cookie-based. The backend sets the JWT as an `httpOnly`, `secure`, `sameSite: strict` cookie. Frontend Javascript cannot access the token (protecting against XSS), and the browser automatically sends it with every request (CORS-configured).
3. **Obfuscated Admin Dashboard URLs**: Dashboard routes are under a randomized route segment `/x7k2m/` (e.g., `/x7k2m/overview`, `/x7k2m/fe-bk`) rather than standard guessing-friendly paths like `/admin` or `/dashboard`.
4. **Error-Only Winston Logger (Date-wise, 30-day Purge)**: Morgan and standard access logging are omitted. Only errors (unhandled exceptions, validation errors, server crashes, database errors) are captured. The logger formats them as JSON, creates files daily in `backend/logs/error-YYYY-MM-DD.log`, and automatically purges log files older than 30 days.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Lucide React, Axios, React Hot Toast
- **Admin**: Next.js 16, Tailwind CSS v4, Recharts (Data Visualization)
- **Backend**: Node.js, Express.js, Mongoose, JWT (jsonwebtoken), BcryptJS
- **Database**: MongoDB (Local or Atlas)
- **Logging & Security**: Winston + Daily Rotate File, Helmet, Express Rate Limit, Cookie Parser

---

## Getting Started

### Step 1: Set Up and Run the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file inside the `backend` directory (a template is available in `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/acowale_crm
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   COOKIE_MAX_AGE=604800000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ADMIN_URL=http://localhost:3001
   ```
4. Start the backend server in /development mode:
   ```bash
   npm run dev
   ```
   *The backend will boot up at `http://localhost:5000`.*

5. Create your initial Admin account:
   For security reasons, admin registration is restricted. Only email addresses pre-configured in the `ALLOWED_ADMIN_EMAILS` environment variable (comma-separated list in `backend/.env`) are allowed to register as administrators.
   
   To register the first admin user manually via a POST request in Postman:
   - Ensure the email you want to use (e.g., `admin@acowale.com` or `testadmin@acowale.com`) is whitelisted in `ALLOWED_ADMIN_EMAILS` inside your `backend/.env` file.
   - **Method**: `POST`
   - **URL**: `http://localhost:5000/api/auth/register`
   - **Body (JSON)**:
     ```json
     {
       "name": "Admin",
       "email": "admin@acowale.com",
       "password": "Admin@123"
     }
     ```
   *(Note: Registering with an unauthorized email address will return a `403 Forbidden` error asking you to contact the administrator).*

---

### Step 2: Set Up and Run the Public Frontend

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environmental variables:
   Create a `.env.local` file inside the `frontend` directory:
   ```env
   BACKEND_URL=http://localhost:5000
   ```
4. Start the public web application:
   ```bash
   npm run dev
   ```
   *The portal will boot up at `http://localhost:3000`.*

---

### Step 3: Set Up and Run the Admin Dashboard

1. Navigate to the admin folder:
   ```bash
   cd ../admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environmental variables:
   Create a `.env.local` file inside the `admin` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the admin panel:
   ```bash
   npm run dev
   ```
   *The admin panel will boot up at `http://localhost:3001`.*

---

## Obfuscated Admin Navigation

Once logged in as an administrator at `http://localhost:3001/auth` (using the seeded credentials `admin@acowale.com` and `Admin@123`), the dashboard pages will live under the following randomized routes:

- **Dashboard / Analytics**: `http://localhost:3001/x7k2m/overview`
- **Feedback Management Table**: `http://localhost:3001/x7k2m/fe-bk`
- **Admin Settings**: `http://localhost:3001/x7k2m/st-ng`

---

## Verifying the Solution

### Manual Verification Flow
1. **Public Submission**: Go to `http://localhost:3000/`, submit feedback with name, email, category, and star rating. The request is securely proxied through the Next.js API handler server-side.
2. **Access logs & Logging**: Inspect the `backend/logs` directory. You will see zero access logs, but any runtime errors will create a file matching `error-YYYY-MM-DD.log`.
3. **Admin Login**: Navigate to `http://localhost:3001/auth` and log in with the seeded credentials (`testadmin@acowale.com` / `Admin@123`).
4. **Dashboard View**: View high-fidelity charts demonstrating category distribution, monthly trend, and ratings in a clean, light-themed admin dashboard.
5. **Manage Feedback**: Navigate to the feedbacks page (`/x7k2m/fe-bk`), update the status of the feedback you submitted from "New" to "In Review" or delete entries.
6. **Health Check**: Visit `http://localhost:5000/api/health` to confirm the API health check works.
7. **Rate Limiting**: Visit the API endpoints repeatedly to verify the rate limiting kicks in.

### Testing via Postman
You can test the backend APIs directly via Postman:
- **Submit Feedback (Public)**: `POST http://localhost:5000/api/feedback`
- **Admin Login (Public)**: `POST http://localhost:5000/api/auth/login` (sets the `token` cookie)
- **Get Summary (Protected)**: `GET http://localhost:5000/api/analytics/summary` (ensure you enable cookie management in Postman so the session is preserved)
- **Fetch Feedbacks (Protected)**: `GET http://localhost:5000/api/feedback`

