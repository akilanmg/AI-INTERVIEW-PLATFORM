# AI Mock Interview Platform 🚀

A production-ready full-stack AI Mock Interview Platform built with the **MERN** stack (**Supabase** instead of MongoDB for better performance and PostgreSQL features), **Express.js**, **React**, and **Node.js**.

## ✨ Features
- **AI-Powered Questions**: Tailwind dynamic questions generated based on role, category, and difficulty using GPT-4.
- **Smart Evaluation**: Instant scores, strengths, weaknesses, and improvement tips.
- **Communication Test**: Voice-to-text integration for practicing oral responses.
- **Performance Analytics**: Visualized trends, category breakdowns, and skill growth charts using Recharts.
- **Secure Auth**: JWT-based authentication with Bcrypt password hashing.
- **Premium UI**: Modern, dark-themed responsive design with glassmorphism and smooth animations.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Recharts, Axios, React Hot Toast, Lucide Icons.
- **Backend**: Node.js, Express.js, JWT, Bcrypt.js, Morgan, Helmet.
- **Database**: Supabase (PostgreSQL).
- **AI**: OpenAI GPT-4 API.
- **Deployment**: Vercel (Backend), Netlify (Frontend).

## 🚀 Getting Started

### 1. Database Setup (Supabase)
- Create a project on [Supabase](https://app.supabase.com/).
- Open the **SQL Editor** and run the contents of `schema.sql`.
- Go to **Project Settings > API** and note down your `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.

### 2. Backend Setup
- In the root directory, update the `.env` file with your credentials:
  ```env
  PORT=5000
  FRONTEND_URL=http://localhost:5173
  SUPABASE_URL=your_supabase_url
  SUPABASE_SERVICE_KEY=your_supabase_service_key
  JWT_SECRET=your_jwt_secret
  OPENAI_API_KEY=your_openai_api_key
  ```
- Install dependencies: `npm install`
- Start the server: `npm run dev`

### 3. Frontend Setup
- Navigate to the frontend directory: `cd frontend`
- Install dependencies: `npm install`
- Start the development server: `npm run dev`

## 🌍 Deployment

### **Backend (Vercel)**
- Push your code to GitHub.
- Connect your repo to **Vercel**.
- Add all environment variables from `.env` in Vercel settings.
- Use `vercel.json` provided in the root.

### **Frontend (Netlify)**
- Push your code to GitHub.
- Connect your repo to **Netlify**.
- Set **Build command**: `npm run build`
- Set **Publish directory**: `dist`
- Add `VITE_API_URL=your_backend_vercel_url` to Netlify environment variables.

---
Built with ❤️ by AI. Practice well and land your dream job!
