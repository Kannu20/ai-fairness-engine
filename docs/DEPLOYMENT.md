# 🚀 Deployment Guide — AI Fairness Engine

## Option A: Vercel (Frontend) + Render (Backend) — Recommended for Hackathon

### Step 1 — Push to GitHub

```bash
cd ai-fairness-engine
git init
git add .
git commit -m "Initial commit — AI Fairness Engine"
gh repo create ai-fairness-engine --public --push
# Or: git remote add origin https://github.com/YOUR_NAME/ai-fairness-engine.git && git push -u origin main
```

---

### Step 2 — Deploy Backend to Render (Free)

1. Go to [render.com](https://render.com) → Sign up / Log in
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   ```
   Name:           ai-fairness-engine-api
   Root Directory: backend
   Runtime:        Node
   Build Command:  npm install
   Start Command:  npm start
   Plan:           Free
   ```
5. Add Environment Variables (under "Environment"):
   ```
   GEMINI_API_KEY  = AIzaSy...your_key
   NODE_ENV        = production
   ALLOWED_ORIGINS = https://your-app.vercel.app
   ```
6. Click **Deploy**
7. Note your URL: `https://ai-fairness-engine-api.onrender.com`

> ⚠️ Free Render instances sleep after 15min inactivity. Use [UptimeRobot](https://uptimerobot.com) to ping `/health` every 5min.

---

### Step 3 — Deploy Frontend to Vercel

**Option A: Vercel CLI**
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

**Option B: Vercel Dashboard (easier)**
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Settings:
   ```
   Framework:        Vite
   Root Directory:   frontend
   Build Command:    npm run build
   Output Directory: dist
   ```
4. Add Environment Variable:
   ```
   VITE_API_URL = https://ai-fairness-engine-api.onrender.com
   ```
5. Deploy!

Your live URL: `https://ai-fairness-engine.vercel.app`

---

## Option B: Google Cloud Run (Backend)

### Prerequisites
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com containerregistry.googleapis.com
```

### Build and Deploy
```bash
cd backend

# Build container
docker build -t ai-fairness-engine .

# Push to Google Container Registry
docker tag ai-fairness-engine gcr.io/YOUR_PROJECT_ID/ai-fairness-engine:latest
docker push gcr.io/YOUR_PROJECT_ID/ai-fairness-engine:latest

# Deploy to Cloud Run
gcloud run deploy ai-fairness-engine \
  --image gcr.io/YOUR_PROJECT_ID/ai-fairness-engine:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5000 \
  --memory 512Mi \
  --set-env-vars "NODE_ENV=production,GEMINI_API_KEY=YOUR_KEY,ALLOWED_ORIGINS=https://your-app.vercel.app"
```

Cloud Run gives you: `https://ai-fairness-engine-xxxxxxxx-uc.a.run.app`

---

## Option C: Firebase Hosting (Frontend) + Cloud Functions (Backend)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting functions

# Frontend build
cd frontend && npm run build

# Deploy
firebase deploy
```

---

## Environment Variable Checklist

### Backend (Required)
| Variable | Value | Required |
|---|---|---|
| `GEMINI_API_KEY` | `AIzaSy...` | For Explainable AI |
| `PORT` | `5000` | Auto-set on cloud |
| `NODE_ENV` | `production` | Performance |
| `ALLOWED_ORIGINS` | Your Vercel URL | CORS security |

### Frontend (Required)
| Variable | Value | Required |
|---|---|---|
| `VITE_API_URL` | Your Render/Cloud Run URL | Yes |

---

## Post-Deployment Verification

```bash
# Test backend health
curl https://your-backend.onrender.com/health

# Test scoring endpoint
curl -X POST https://your-backend.onrender.com/api/score/compare \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Johnson","gender":"male","education":"Bachelor'\''s","experience":5,"skills":["JavaScript","React","Node.js"]}'

# Expected response:
# { "success": true, "biased": {...}, "fair": {...}, "analysis": {...} }
```

---

## Hackathon Day Checklist

- [ ] Backend deployed and `/health` returns 200
- [ ] Frontend deployed and accessible
- [ ] `VITE_API_URL` points to live backend
- [ ] Gemini API key entered in UI header
- [ ] Tested with "Alex Johnson" and "Priya Sharma" — bias visible
- [ ] What-If simulator shows score change
- [ ] Statistics tab loads with all 8 candidates
- [ ] Explanation panel shows static fallback (Gemini optional bonus)
