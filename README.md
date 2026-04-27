# ⚖️ AI Decision Fairness Engine
### Detecting and Eliminating Bias in Automated Decisions

> **Hackathon Project** — Full-stack AI bias detection system for the hiring domain.  
> Built with React + Tailwind, Node.js/Express, and Google Gemini AI.

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture)
2. [Quick Start (Local)](#quick-start)
3. [Environment Variables](#environment-variables)
4. [Deployment Guide](#deployment)
5. [Sample Dataset](#sample-dataset)
6. [Demo Script](#demo-script)
7. [Project Structure](#project-structure)

---

## Architecture Overview <a name="architecture"></a>

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  Dashboard │ Candidate Form │ Bias Toggle │ Charts │ XAI    │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────────────────┐
│                   BACKEND (Node/Express)                     │
│  /api/score/biased  │  /api/score/fair  │  /api/explain     │
│  BiasEngine         │  FairEngine       │  GeminiService     │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │  Google Gemini 1.5 Flash │
          │  (Explainable AI layer)  │
          └──────────────────────────┘
```

**Bias Factors Injected (Demo):**
| Factor | Biased Weight | Fair Weight |
|---|---|---|
| Gender (male) | +18 pts | 0 |
| Gender (female) | -12 pts | 0 |
| Western name | +12 pts | 0 |
| Non-western name | -8 pts | 0 |
| Skills match | Up to 38 pts | Up to 52 pts |
| Experience | Up to 22 pts | Up to 33 pts |
| Education | Up to 8 pts | Up to 10 pts |

---

## Quick Start (Local) <a name="quick-start"></a>

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/ai-fairness-engine.git
cd ai-fairness-engine

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment Variables <a name="environment-variables"></a>

### Backend (`backend/.env`)
```
GEMINI_API_KEY=AIzaSy...your_key_here
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,https://your-app.vercel.app
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE=AI Fairness Engine
```

---

## Deployment Guide <a name="deployment"></a>

### Frontend → Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend.onrender.com
```

Or connect your GitHub repo to Vercel at [vercel.com](https://vercel.com) — it auto-detects Vite.

**`vercel.json` is pre-configured** for React SPA routing.

---

### Backend → Render (Free Tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo → select `backend/` as root directory
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add environment variables:
   - `GEMINI_API_KEY` → your key
   - `NODE_ENV` → `production`
   - `ALLOWED_ORIGINS` → your Vercel URL

Render gives you a free HTTPS URL like `https://ai-fairness-engine.onrender.com`

---

### Backend → Google Cloud Run (Alternative)

```bash
cd backend

# Build Docker image
docker build -t ai-fairness-engine .

# Tag & push to Google Container Registry
docker tag ai-fairness-engine gcr.io/YOUR_PROJECT/ai-fairness-engine
docker push gcr.io/YOUR_PROJECT/ai-fairness-engine

# Deploy to Cloud Run
gcloud run deploy ai-fairness-engine \
  --image gcr.io/YOUR_PROJECT/ai-fairness-engine \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

---

## Sample Dataset <a name="sample-dataset"></a>

Six candidates with **identical merit profiles** — varying only by name and gender — to demonstrate bias:

| Name | Gender | Edu | Experience | Skills | Biased Score | Fair Score | Decision Changed? |
|---|---|---|---|---|---|---|---|
| Alex Johnson | Male | Bachelor's | 5 yrs | JS, React, Node, Python, SQL | 73 | 60 | — |
| Priya Sharma | Female | Master's | 6 yrs | JS, React, Node, Python, SQL | 41 | 68 | ✅ YES |
| James Wilson | Male | Bachelor's | 4 yrs | JS, React, SQL | 58 | 38 | — |
| Fatima Al-Hassan | Female | Bachelor's | 4 yrs | JS, React, SQL | 22 | 38 | ✅ YES |
| Ryan O'Brien | Male | PhD | 8 yrs | All 7 skills | 100 | 95 | — |
| Wei Zhang | Male | Master's | 7 yrs | 6/7 skills | 66 | 82 | — |

*Key Demo Point: Priya Sharma (female, Master's, 6yr exp) scores lower than Alex Johnson (male, Bachelor's, 5yr exp) in the biased system — despite being more qualified.*

---

## Demo Script <a name="demo-script"></a>

### ⏱️ 5-Minute Hackathon Pitch

**[0:00–0:30] Hook**
> "Every day, AI systems make thousands of hiring decisions. But what if I told you these systems could be systematically discriminating — and nobody would know? Today I'm going to show you bias in real time, and then eliminate it."

**[0:30–1:30] Demonstrate the Problem**
1. Open the **Analyze** tab
2. Load sample candidate **"Alex Johnson"** (male, Bachelor's, 5yr) → Analyze
3. Note biased score: ~73/100, HIRED
4. Now switch to **"Priya Sharma"** (female, Master's, 6yr, more qualified) → Analyze
5. Note biased score: ~41/100, REJECTED
> "Same job. More qualified. Different name and gender. The biased AI rejected her."

**[1:30–2:30] What-If Simulation**
1. Click **What-If** tab
2. With Priya Sharma loaded, change name to "Alex Johnson", gender to Male → Run Simulation
3. Show the score jump
> "We gave Priya a male Western name. Instantly, 30+ more points. Same skills. Same experience. The AI is hiring the name, not the person."

**[2:30–3:30] The Fix**
1. Go back to **Compare** tab
2. Show the side-by-side table
> "Our Fair System strips out every protected attribute. Gender: ignored. Name: ignored. Only skills, experience, and education count. Watch the scores normalize."

**[3:30–4:30] Explainable AI with Gemini**
1. Show the **Explanation Panel** (bottom of Analyze tab)
2. If API key is connected, show live Gemini output
> "We use Google Gemini AI to generate human-readable explanations of every decision. This is Explainable AI — the missing layer in most automated hiring tools."

**[4:30–5:00] Closing**
1. Click **Statistics** tab — show aggregate bias chart
> "Across our test dataset, the biased system wrongly rejected 2 out of 6 candidates due to demographics. Our Fairness Engine corrects that — zero bias, full transparency, auditable decisions. That's AI you can trust."

---

## Project Structure <a name="project-structure"></a>

```
ai-fairness-engine/
├── README.md
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   ├── .env.example
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── CandidateForm.jsx
│       │   ├── ScoreCard.jsx
│       │   ├── ComparisonTable.jsx
│       │   ├── BiasChart.jsx
│       │   ├── ExplanationPanel.jsx
│       │   ├── WhatIfSimulator.jsx
│       │   └── StatisticsView.jsx
│       ├── pages/
│       │   └── Dashboard.jsx
│       ├── hooks/
│       │   └── useScoring.js
│       └── utils/
│           └── api.js
└── backend/
    ├── package.json
    ├── server.js
    ├── Dockerfile
    ├── .env.example
    ├── routes/
    │   ├── score.js
    │   └── explain.js
    ├── services/
    │   ├── biasEngine.js
    │   ├── fairEngine.js
    │   └── geminiService.js
    ├── middleware/
    │   ├── cors.js
    │   └── rateLimit.js
    └── data/
        └── sampleCandidates.json
```
