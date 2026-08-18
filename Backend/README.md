# BeKids Backend REST API

This is the Node.js + Express + TypeScript + Prisma development backend for the **BeKids English Learning App**.

---

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Framework:** Express 4.x
- **ORM:** Prisma Client
- **Database:** SQLite (local development database `prisma/dev.db`)
- **Security:** bcryptjs (password hashing), jsonwebtoken (Bearer JWT auth)
- **Validation:** Zod

---

## 📁 Architecture Overview

```
Backend/
├── prisma/
│   ├── schema.prisma       # Relational database models (User, OtpVerification, Verb, etc.)
│   ├── migrations/         # SQLite schema migration history
│   └── seed.ts             # Initial data seeder (10 core verbs & demo user)
├── src/
│   ├── config/             # Environment & Prisma client singleton
│   ├── controllers/        # Route controllers (Auth, User, Verb)
│   ├── middleware/         # Auth, validation, & error handling middleware
│   ├── repositories/       # Data access layer (Prisma queries)
│   ├── routes/             # Express API routes
│   ├── services/           # Business logic layer
│   ├── types/              # Domain & DTO interfaces
│   ├── utils/              # Password hashing, JWT, OTP generation
│   ├── validators/         # Zod request payload schemas
│   ├── app.ts              # Express app setup & middleware
│   └── server.ts           # Server bootstrap & DB connection
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file (copied from `.env.example`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="bekids_super_secret_jwt_key_for_dev_2026"
JWT_EXPIRES_IN="7d"
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=5
CORS_ORIGIN="*"
```

### 3. Initialize Database & Seed Data
```bash
npx prisma migrate dev --name init
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`.

---

## 🔑 Default Test Credentials & Dev OTP

- **Demo User:** `AlexStudent`
- **Demo Email:** `alex.johnson@example.com`
- **Demo Password:** `password123`

### Development OTP Flow
In development mode (`NODE_ENV=development`), when initiating registration, login, or resend OTP:
1. The 6-digit OTP code is printed directly to the **backend terminal console**.
2. The OTP code is also returned in the development JSON response field `devOtp` for fast testing.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (generates dev OTP) | No |
| `POST` | `/api/auth/login` | Verify credentials & request OTP | No |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP & receive JWT token | No |
| `POST` | `/api/auth/resend-otp` | Generate a new OTP code | No |
| `POST` | `/api/auth/logout` | End session | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Yes** (Bearer Token) |

### 👤 User Profile & Account (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `PATCH` | `/api/users/me` | Update username, email, full name, or password | **Yes** (Bearer Token) |
| `POST` | `/api/users/me/deactivate` | Deactivate user account (soft delete) | **Yes** (Bearer Token) |

### 📚 Verbs Catalog (`/api/verbs`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/verbs` | List all verbs (supports `?search=query`) | No |
| `GET` | `/api/verbs/:id` | Get single verb details with examples & usage rules | No |

---

## 🐘 Future Neon / PostgreSQL Migration Guide

When transitioning from local SQLite to a cloud PostgreSQL database (such as Neon):

1. **Update `prisma/schema.prisma`:**
   Change the datasource provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Update `.env`:**
   Set the Neon PostgreSQL connection string:
   ```env
   DATABASE_URL="postgres://username:password@ep-sample-12345.us-east-2.aws.neon.tech/bekids?sslmode=require"
   ```

3. **Run Prisma Migrations:**
   ```bash
   npx prisma migrate dev --name init_neon
   ```

4. **Seed the Production Database:**
   ```bash
   npm run seed
   ```

Because all model IDs use UUIDs or slugs, queries go through the repository layer, and dates use standard ISO timestamps, the backend code and the mobile frontend require **zero code changes** for PostgreSQL compatibility.
