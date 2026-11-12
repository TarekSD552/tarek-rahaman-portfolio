# Tarek Rahaman — Personal Portfolio & Admin CMS

A high-performance, cinematic personal portfolio and administrative Content Management System (CMS) engineered with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Three.js, Framer Motion, and Lenis smooth scrolling.

---

## 🚀 Features

- **Cinematic Experience**: 3D interactive Three.js backgrounds, smooth Lenis scrolling, and Framer Motion micro-interactions.
- **Full Responsive Design**: Pixel-perfect responsive layouts tested across Mobile (320px–430px), Tablet (768px–1024px), and 4K Ultra-wide displays.
- **Admin CMS**: Built-in secure administrative control panel (`/admin`) for editing services, skills, portfolio projects, client testimonials, and site content.
- **AI Assistant**: Intelligent portfolio chat assistant powered by Google Gemini API with verified developer knowledge.
- **Dynamic Media System**: Dedicated media upload, asset streaming, and audio playback system.
- **SEO & Performance**: 100% Core Web Vitals optimized, complete metadata, sitemap.xml, and robots.txt.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **3D & Animations**: Three.js, Framer Motion, GSAP, Canvas Confetti
- **Icons**: Lucide React
- **Smooth Scroll**: Lenis

---

## 📦 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or higher (`v20`, `v22`, or latest LTS recommended)
- **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`

### 2. Installation

Clone or extract the repository, then install dependencies:

```bash
npm install
```

### 3. Environment Variables Setup

Copy the example environment file to `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and configure your credentials:

```env
# Server Environment
NODE_ENV=production
PORT=3000

# Google Gemini API Key for AI Assistant (Free from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Administrator Credentials (for /admin login)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_admin_password

# Session Secret (Generate via `openssl rand -hex 32`)
ADMIN_SESSION_SECRET=your_random_64_char_session_secret
```

### 4. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build

To test and build the production bundle locally:

```bash
npm run build
npm run start
```

---

## 🌐 Hostinger Deployment Guide (Node.js / VPS)

### Option A: Hostinger Node.js Web Hosting (hPanel)

1. **Upload Project**:
   - Upload the project ZIP (excluding `node_modules` and `.next`) to your Hostinger file manager (e.g., inside `public_html` or application directory).
   - Extract the files.
2. **Create/Configure `.env`**:
   - In the root folder, create `.env` (or set environment variables in hPanel) using `.env.example` as reference.
3. **Configure Node.js in hPanel**:
   - **Node.js Version**: Select `20.x` or higher.
   - **Application Root**: Set to project directory.
   - **Application Startup File**: `node_modules/next/dist/bin/next` with argument `start` (or use custom script `npm start`).
4. **Install Dependencies & Build**:
   - Open SSH / Terminal in hPanel and run:
     ```bash
     npm install --production=false
     npm run build
     ```
5. **Start Application**: Click **Restart Application** in hPanel.

---

### Option B: Hostinger VPS / Ubuntu Server (PM2 + Nginx)

1. **Clone or Transfer Project**:
   ```bash
   git clone <your-github-repo-url> tarek-portfolio
   cd tarek-portfolio
   ```
2. **Setup Environment**:
   ```bash
   cp .env.example .env.local
   nano .env.local
   ```
3. **Install & Build**:
   ```bash
   npm install
   npm run build
   ```
4. **Run with PM2**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "tarek-portfolio" -- start
   pm2 save
   pm2 startup
   ```
5. **Nginx Reverse Proxy**:
   Point port `80`/`443` reverse proxy to `http://127.0.0.1:3000`.

---

## 📄 License

Private & Proprietary © Tarek Rahaman. All rights reserved.
