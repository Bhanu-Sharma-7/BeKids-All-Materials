# 🌟 BeKids — Interactive English Verb Learning Platform

**BeKids** is an engaging, child-friendly English verb learning platform designed to help children master English grammar, verb forms (V1–V5), pronunciation, Hindi translations, and sentence usage through audio, animations, and interactive challenges.

---

## 🏗️ Project Architecture

The BeKids repository is organized into three decoupled, production-ready modules:

```
BeKids/
├── 📱 Application/       # React Native + Expo Mobile Application (iOS & Android)
├── 💻 Admin/             # Vite + React Admin Portal for Verb Catalog & Content Management
└── ⚙️ Backend/           # Express.js + Prisma ORM + PostgreSQL REST API with Resend Email
```

---

## 🚀 Live Services & Deployment

* **Backend Live Base URL**: `https://bekids-backend.onrender.com/api`
* **Health Check**: `https://bekids-backend.onrender.com/api/health`
* **Android APK Direct Download**: [Download BeKids APK](https://expo.dev/artifacts/eas/AnNNfyuiyUzz8E0JqwdCScePF73Q-Sh2GS5vbkWsOm8.apk)
* **EAS Build Page**: [Expo EAS Build Dashboard](https://expo.dev/accounts/bhanusharma07/projects/bekids/builds/e373c460-2093-42a8-9709-bf39f1e180b1)

---

## 📱 1. Mobile Application (`/Application`)

Built with **React Native (v0.81)** and **Expo SDK 54** using TypeScript.

### ✨ Features
* **Verb Explorer**: Search & filter regular/irregular verbs with instant search.
* **Verb Detail Cards**: Complete forms breakdown (`V1`, `V2`, `V3`, `V4`, `V5`) with English phonetic guide and Hindi translations.
* **Text-to-Speech (TTS)**: Interactive audio pronunciation for every verb form and example sentence.
* **Profile & Avatar Management**: Custom gallery photo upload, camera capture, or 6 curated animal avatar presets.
* **Live Backend Synchronization**: Dynamic data repository fetching from PostgreSQL database via Render REST API.

### 🛠️ Local Development
```bash
cd Application
npm install
npx expo start
```

### 📦 Building Android APK (EAS Build)
```bash
cd Application
npx eas build --platform android --profile preview
```

---

## 💻 2. Admin Portal (`/Admin`)

A dashboard built with **React 19 + Vite + TypeScript**.

### ✨ Features
* **Catalog Management**: Create, edit, view, and delete verbs.
* **Bulk JSON Import**: Upload structured `.json` verb files directly into the PostgreSQL database.
* **Authentication**: Token-based secure administrator access.

### 🛠️ Local Development
```bash
cd Admin
npm install
npm run dev
```

---

## ⚙️ 3. Backend API (`/Backend`)

REST API built with **Node.js, Express.js, TypeScript, and Prisma ORM** connected to a **Neon PostgreSQL** database.

### 🔐 Authentication & OTP Flow
* **Registration / Login**: Two-step email verification.
* **OTP Delivery**: Automated 6-digit verification code dispatch to the user's Gmail inbox via **Resend**.
* **Session Management**: Secure JWT authentication tokens.

### 🛠️ Local Development
```bash
cd Backend
npm install
npm run dev
```

---

## 🔑 Environment Variables Guide

### 📱 `Application/.env`
```env
EXPO_PUBLIC_API_URL=https://bekids-backend.onrender.com/api
```

### 💻 `Admin/.env`
```env
VITE_API_URL=https://bekids-backend.onrender.com/api
```

### ⚙️ `Backend/.env` (and Render Environment)
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="7d"
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=5
CORS_ORIGIN="*"
ADMIN_EMAIL="bhanusharma@admin.com"
ADMIN_PASSWORD="your_admin_password"
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="BeKids <onboarding@resend.dev>"
```

---

## 🧪 Verification & Health Checks

Run static analysis across all workspaces:

```bash
# Mobile TypeScript check
cd Application && npx tsc --noEmit

# Backend TypeScript check
cd ../Backend && npx tsc --noEmit
```

---

## 📄 License
This project is licensed under the MIT License.
