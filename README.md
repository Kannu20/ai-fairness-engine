<div align="center">

<br/>

```
 ██████╗  █████╗ ██╗██████╗ ███╗   ██╗███████╗███████╗███████╗
 ██╔══██╗██╔══██╗██║██╔══██╗████╗  ██║██╔════╝██╔════╝██╔════╝
 ███████║███████║██║██████╔╝██╔██╗ ██║█████╗  ███████╗███████╗
 ██╔══██╗██╔══██║██║██╔══██╗██║╚██╗██║██╔══╝  ╚════██║╚════██║
 ██║  ██║██║  ██║██║██║  ██║██║ ╚████║███████╗███████║███████║
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝╚══════╝
```

# ⚖️ AI Decision Fairness Engine

### *Detecting and Eliminating Bias in Automated Decisions*

<br/>

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![API on Render](https://img.shields.io/badge/API_on-Render-46E3B7?style=flat-square&logo=render&logoColor=black)](https://render.com)

<br/>

> **🏆 Hackathon Project** — Built to demonstrate, detect, and eliminate algorithmic bias  
> in AI-powered hiring systems using real-time comparison and Google Gemini AI.

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

</div>

<br/>

## 📸 Preview

<div align="center">

| Analyze Tab | Compare Tab | What-If Simulator | Statistics |
|:-----------:|:-----------:|:-----------------:|:----------:|
| Biased vs Fair scores | Side-by-side diff table | Swap name/gender → see bias | Aggregate bias analysis |

</div>

<br/>

---

## 🧠 The Problem We're Solving

> **"The AI rejected her. But she was more qualified."**

Every day, AI systems make thousands of hiring decisions — and many of them are secretly biased.
Studies show that identical resumes with different names and genders receive dramatically different
callback rates. Our system makes this invisible discrimination **visible, measurable, and fixable**.

```
 Priya Sharma (Female, Master's, 6yr exp)  →  Biased AI: 41/100  → ❌ REJECTED
 Alex Johnson  (Male,   Bachelor's, 5yr exp)  →  Biased AI: 73/100  → ✅ HIRED

 Same skills. Alex is LESS qualified. Priya is penalised for her name and gender.

 ─────────────────────────────────────────────────────────
  Fair AI Engine → Priya: 68/100 ✅ HIRED   Alex: 60/100 ✅ HIRED
  Merit-based. No demographics. Correct outcome.
 ─────────────────────────────────────────────────────────
```

<br/>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔴 Bias Detection
- Real-time gender bias scoring
- Name perception bias (audit-study backed)
- Quantified bias impact in points
- Visual bias indicators on every score card

</td>
<td width="50%">

### 🟢 Bias Elimination
- Merit-only fair scoring engine
- Protected attributes explicitly zeroed
- Transparent, auditable weight system
- EEOC & EU AI Act compliant architecture

</td>
</tr>
<tr>
<td width="50%">

### 🔬 What-If Simulator
- Change name and gender in real time
- Identical qualifications, different demographics
- See score swing with zero skill change
- Gemini AI narrative for each simulation

</td>
<td width="50%">

### ✨ Explainable AI (XAI)
- Google Gemini 1.5 Flash integration
- Structured JSON explanation output
- Legal risk assessment per decision
- Human-readable bias analysis

</td>
</tr>
<tr>
<td width="50%">

### 📊 Visual Analytics
- Score breakdown bar charts (Recharts)
- Bias impact visualisation
- Gender gap comparison charts
- Full 8-candidate aggregate dataset

</td>
<td width="50%">

### ⚡ Offline-First Architecture
- Full client-side fallback scoring
- Works without backend connection
- Mirrors backend logic exactly
- Perfect for hackathon demos

</td>
</tr>
</table>

<br/>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND  (React + Tailwind)                  │
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │ Analyze  │  │ Compare  │  │ What-If  │  │  Charts  │  │ Stats │ │
│  │   Tab    │  │   Tab    │  │Simulator │  │   Tab    │  │  Tab  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬───┘ │
│       └─────────────┴─────────────┴──────────────┴────────────┘     │
│                               useScoring() hook                       │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │  REST API (JSON)
┌──────────────────────────────────▼──────────────────────────────────┐
│                       BACKEND  (Node.js + Express)                   │
│                                                                       │
│   POST /api/score/biased    POST /api/score/fair                     │
│   POST /api/score/compare   POST /api/score/whatif                   │
│   POST /api/explain/bias    POST /api/explain/resume                 │
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐   │
│  │   BiasEngine    │  │   FairEngine    │  │   GeminiService    │   │
│  │  ─────────────  │  │  ─────────────  │  │  ────────────────  │   │
│  │  gender bias    │  │  skills only    │  │  XAI explanation   │   │
│  │  name bias      │  │  experience     │  │  resume parsing    │   │
│  │  threshold: 58  │  │  education      │  │  what-if narrative │   │
│  └─────────────────┘  │  threshold: 55  │  └────────┬───────────┘   │
│                        └─────────────────┘           │               │
└──────────────────────────────────────────────────────┼───────────────┘
                                                        │
                                          ┌─────────────▼────────────┐
                                          │  Google Gemini 1.5 Flash  │
                                          │  Explainable AI Layer     │
                                          └──────────────────────────┘
```

<br/>

---

## ⚖️ Bias Scoring Model

### Biased System (What NOT to do)

| Factor | Male | Female | Western Name | Non-Western Name |
|:------:|:----:|:------:|:------------:|:----------------:|
| Weight | **+18 pts** | **-12 pts** | **+12 pts** | **-8 pts** |
| Legal status | ❌ Illegal | ❌ Illegal | ❌ Illegal | ❌ Illegal |

### Fair System (Our Solution)

| Factor | Weight | Max Score | Justification |
|:------:|:------:|:---------:|:-------------:|
| Skills match | 55% | 52 pts | Direct job performance predictor |
| Experience | 35% | 33 pts | Years of relevant practice |
| Education | 15% | 15 pts | Baseline qualification signal |
| Gender | **0%** | 0 pts | Protected attribute — ignored |
| Name | **0%** | 0 pts | Protected attribute — ignored |

> Scoring methodology aligns with **EEOC guidelines**, **EU AI Act Article 10**, and **ISO/IEC 24027** (AI Bias standard).

<br/>

---

## 🗂️ Project Structure

```
ai-fairness-engine/
│
├── 📄 README.md
├── 📄 package.json              ← Root scripts (dev, build, install:all)
├── 📄 .gitignore
│
├── 🖥️  frontend/
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 vercel.json           ← SPA routing for Vercel
│   ├── 📄 .env.example
│   └── src/
│       ├── 📄 App.jsx           ← Root app with routing
│       ├── 📄 main.jsx          ← React entry point
│       ├── 📄 index.css         ← Tailwind + custom utilities
│       │
│       ├── pages/
│       │   └── 📄 Dashboard.jsx ← 5-tab main layout
│       │
│       ├── components/
│       │   ├── 📄 Header.jsx           ← Nav + Gemini API key input
│       │   ├── 📄 CandidateForm.jsx    ← Full form with sample presets
│       │   ├── 📄 ScoreCard.jsx        ← Biased / fair result display
│       │   ├── 📄 ComparisonTable.jsx  ← Side-by-side diff table
│       │   ├── 📄 BiasChart.jsx        ← Recharts visualisations
│       │   ├── 📄 ExplanationPanel.jsx ← Gemini XAI + static fallback
│       │   ├── 📄 WhatIfSimulator.jsx  ← Demographic swap tool
│       │   └── 📄 StatisticsView.jsx  ← Aggregate 8-candidate analysis
│       │
│       ├── hooks/
│       │   └── 📄 useScoring.js  ← Scoring hook + client-side fallback
│       │
│       └── utils/
│           └── 📄 api.js         ← Axios API layer (score + explain)
│
├── ⚙️  backend/
│   ├── 📄 server.js             ← Express entry point
│   ├── 📄 package.json
│   ├── 📄 Dockerfile            ← For Google Cloud Run
│   ├── 📄 .env.example
│   │
│   ├── routes/
│   │   ├── 📄 score.js          ← /biased /fair /compare /whatif /batch
│   │   └── 📄 explain.js        ← /bias /resume /whatif (Gemini-powered)
│   │
│   ├── services/
│   │   ├── 📄 biasEngine.js     ← ⚠️  Intentional bias injection (demo)
│   │   ├── 📄 fairEngine.js     ← ✅  Merit-only fair scoring
│   │   └── 📄 geminiService.js  ← Google Gemini 1.5 Flash XAI
│   │
│   ├── middleware/
│   │   ├── 📄 cors.js
│   │   └── 📄 rateLimit.js
│   │
│   └── data/
│       └── 📄 sampleCandidates.json  ← 8-candidate bias demo dataset
│
└── 📁 docs/
    ├── 📄 DEPLOYMENT.md         ← Vercel + Render + Cloud Run guide
    └── 📄 DEMO_SCRIPT.md        ← Full 5-min pitch with timestamps
```

<br/>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ — [download](https://nodejs.org)
- **npm** or **yarn**
- **Gemini API key** (free) — [get one here](https://aistudio.google.com/app/apikey)

<br/>

### 1️⃣  Clone & Install

```bash
git clone https://github.com/your-username/ai-fairness-engine.git
cd ai-fairness-engine

# Install all dependencies (frontend + backend) in one command
npm run install:all
```

### 2️⃣  Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
GEMINI_API_KEY=AIzaSy_your_key_here
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

```bash
# Frontend
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 3️⃣  Run

```bash
# From the root — starts both servers concurrently
npm run dev
```

| Service | URL |
|:-------:|:---:|
| 🖥️ Frontend | [http://localhost:5173](http://localhost:5173) |
| ⚙️ Backend API | [http://localhost:5000](http://localhost:5000) |
| 💚 Health check | [http://localhost:5000/health](http://localhost:5000/health) |

> **💡 No backend? No problem.** The frontend has full client-side fallback scoring built in. Works completely offline for demos.

<br/>

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
# Set env var: VITE_API_URL = https://your-backend.onrender.com
```

### Backend → Render *(Free tier)*

1. Connect GitHub repo at [render.com](https://render.com)
2. Root directory: `backend` · Build: `npm install` · Start: `npm start`
3. Add env vars: `GEMINI_API_KEY`, `NODE_ENV=production`, `ALLOWED_ORIGINS`

### Backend → Google Cloud Run

```bash
cd backend
docker build -t ai-fairness-engine .
docker tag ai-fairness-engine gcr.io/YOUR_PROJECT/ai-fairness-engine
docker push gcr.io/YOUR_PROJECT/ai-fairness-engine

gcloud run deploy ai-fairness-engine \
  --image gcr.io/YOUR_PROJECT/ai-fairness-engine \
  --platform managed --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=your_key,NODE_ENV=production"
```

> 📖 Full deployment guide → [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

<br/>

---

## 📡 API Reference

### `POST /api/score/compare`
Returns both biased and fair scores with full diff analysis.

```json
// Request
{
  "name": "Priya Sharma",
  "gender": "female",
  "education": "Master's",
  "experience": 6,
  "skills": ["JavaScript", "React", "Node.js", "Python", "SQL"]
}

// Response
{
  "success": true,
  "biased": {
    "total": 41,
    "decision": "REJECTED",
    "breakdown": {
      "skills": 27, "experience": 19, "education": 5,
      "genderBias": -12, "nameBias": -8, "totalBiasImpact": -20
    }
  },
  "fair": {
    "total": 68,
    "decision": "HIRED",
    "breakdown": {
      "skills": 37, "experience": 28, "education": 7,
      "genderBias": 0, "nameBias": 0
    }
  },
  "analysis": {
    "decisionChanged": true,
    "biasImpact": -20,
    "verdict": "CRITICAL: Bias changed the hiring decision.",
    "fairnessIndex": 60
  }
}
```

### All Endpoints

| Method | Endpoint | Description |
|:------:|:--------:|:-----------:|
| `GET` | `/health` | API health check |
| `POST` | `/api/score/biased` | Biased score only |
| `POST` | `/api/score/fair` | Fair score only |
| `POST` | `/api/score/compare` | Both scores + analysis |
| `POST` | `/api/score/whatif` | What-if simulation |
| `POST` | `/api/score/batch` | Batch up to 20 candidates |
| `POST` | `/api/explain/bias` | Gemini XAI explanation |
| `POST` | `/api/explain/resume` | Parse resume text via Gemini |
| `GET` | `/api/samples` | Sample candidate dataset |
| `GET` | `/api/domains` | Available scoring domains |

<br/>

---

## 🧪 Sample Dataset

Eight candidates with **comparable qualifications** — varying only by name and gender.

| # | Candidate | Gender | Education | Exp | Biased | Fair | Decision Changed |
|:-:|:---------|:------:|:---------:|:---:|:------:|:----:|:----------------:|
| 1 | Alex Johnson | Male | Bachelor's | 5yr | 73 | 60 | — |
| 2 | **Priya Sharma** | **Female** | **Master's** | **6yr** | **41** | **68** | **✅ YES** |
| 3 | James Wilson | Male | Bachelor's | 4yr | 58 | 38 | — |
| 4 | **Fatima Al-Hassan** | **Female** | **Bachelor's** | **4yr** | **22** | **38** | **✅ YES** |
| 5 | Ryan O'Brien | Male | PhD | 8yr | 100 | 95 | — |
| 6 | Wei Zhang | Male | Master's | 7yr | 66 | 82 | — |
| 7 | **Maria Garcia** | **Female** | **Master's** | **7yr** | **46** | **82** | **✅ YES** |
| 8 | David Miller | Male | Master's | 7yr | 90 | 82 | — |

> 🔑 **Key insight:** Rows 7 and 8 have *identical* qualifications. The biased system scores David 44 points higher than Maria. Same degree, same experience, same skills.

<br/>

---

## 🔬 The Science Behind It

This project is grounded in real academic research on algorithmic bias:

| Research | Finding | Our Implementation |
|:--------:|:-------:|:-----------------:|
| [Bertrand & Mullainathan (2004)](https://www.nber.org/papers/w9873) | "White-sounding" names get 50% more callbacks | Name perception bias weight |
| [MIT & Stanford (2018)](https://proceedings.mlr.press/v81/buolamwini18a.html) | Gender classification systems 34% less accurate on darker-skinned women | Gender bias weight |
| [Amazon Hiring Algorithm (2018)](https://www.reuters.com/article/us-amazon-com-jobs-automation-insight/) | Penalised resumes with the word "women's" | Demonstrates real-world risk |
| [EEOC Guidelines](https://www.eeoc.gov/laws/guidance) | Protected attributes prohibited in employment decisions | Fair system compliance layer |

<br/>

---

## 🧩 Tech Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
<tr>
<td><strong>UI Framework</strong></td>
<td>React 18 + Vite</td>
<td>Fast, modern component-based UI</td>
</tr>
<tr>
<td><strong>Styling</strong></td>
<td>Tailwind CSS 3.4</td>
<td>Utility-first responsive design</td>
</tr>
<tr>
<td><strong>Charts</strong></td>
<td>Recharts 2.12</td>
<td>Bar charts, bias visualisations</td>
</tr>
<tr>
<td><strong>State</strong></td>
<td>React hooks + custom useScoring</td>
<td>Scoring state + offline fallback</td>
</tr>
<tr>
<td><strong>API Client</strong></td>
<td>Axios</td>
<td>REST calls to backend</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>Node.js + Express 4</td>
<td>Scoring API + Gemini proxy</td>
</tr>
<tr>
<td><strong>Validation</strong></td>
<td>express-validator</td>
<td>Request schema validation</td>
</tr>
<tr>
<td><strong>Security</strong></td>
<td>Helmet + CORS + Rate limiting</td>
<td>Production-hardened API</td>
</tr>
<tr>
<td><strong>AI Layer</strong></td>
<td>Google Gemini 1.5 Flash</td>
<td>Explainable AI, resume parsing</td>
</tr>
<tr>
<td><strong>Containerisation</strong></td>
<td>Docker</td>
<td>Cloud Run deployment</td>
</tr>
<tr>
<td><strong>Frontend Deploy</strong></td>
<td>Vercel</td>
<td>Global CDN, auto HTTPS</td>
</tr>
<tr>
<td><strong>Backend Deploy</strong></td>
<td>Render / Google Cloud Run</td>
<td>Managed Node.js hosting</td>
</tr>
</table>

<br/>

---

## 🎤 Hackathon Demo (5 Minutes)

> Full script with timestamps → [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md)

```
[0:00 – 0:30]  🔴  The Hook — AI is making hiring decisions right now
[0:30 – 1:45]  🔴  Show the problem — Alex vs Priya, same skills, different score
[1:45 – 2:45]  🔬  What-If simulation — change name → score jumps 30+ points
[2:45 – 3:30]  🟢  The fix — Fair System eliminates the bias completely
[3:30 – 4:15]  ✨  Gemini XAI — AI explaining every decision in plain English
[4:15 – 4:45]  📊  Statistics — systemic bias across 8 candidates
[4:45 – 5:00]  🏁  Close — "Fair AI starts here"
```

<br/>

---

## 🗺️ Roadmap

- [x] Hiring domain — resume & skills scoring
- [x] Gemini AI — explainability layer
- [x] What-if simulator
- [x] Aggregate statistics view
- [ ] 🔜 Loan approval domain
- [ ] 🔜 Resume upload (PDF parsing via Gemini)
- [ ] 🔜 Bias audit log / compliance report export
- [ ] 🔜 Custom bias threshold configuration
- [ ] 🔜 Batch CSV upload for HR teams
- [ ] 🔜 Historical fairness trend dashboard

<br/>

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/loan-domain`
3. Commit changes: `git commit -m "feat: add loan approval scoring"`
4. Push: `git push origin feature/loan-domain`
5. Open a Pull Request

<br/>

---

## 📄 License

This project is licensed under the **MIT License** — see [`LICENSE`](LICENSE) for details.

<br/>

---

## ⚠️ Disclaimer

> The biased scoring engine in this project **intentionally injects discriminatory factors** for educational demonstration purposes only. The bias logic exists to make real-world algorithmic discrimination visible and measurable.
>
> **In production AI systems, protected attributes (gender, name, age, ethnicity, religion) must never be used as scoring factors.** This is illegal under EEOC guidelines (US), the Equality Act 2010 (UK), and the EU AI Act.

<br/>

---

<div align="center">

**Built with ❤️ for a fairer, more equitable AI future**

<br/>

*"Algorithms should amplify human potential — not perpetuate human prejudice."*

<br/>

[![⚖️ AI Fairness Engine](https://img.shields.io/badge/⚖️_AI-Fairness_Engine-6366f1?style=for-the-badge)](https://github.com/your-username/ai-fairness-engine)

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

*Star ⭐ this repo if it helped you · Report issues → [GitHub Issues](../../issues)*

</div>
