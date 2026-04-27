# 🎤 Demo Script — AI Fairness Engine
### Hackathon Presentation Guide (5 minutes)

---

## Pre-Demo Setup (5 min before)

1. Open app in browser — fullscreen, zoom 110%
2. Have two browser tabs ready:
   - Tab 1: Your live app
   - Tab 2: [aistudio.google.com](https://aistudio.google.com) (backup Gemini demo)
3. Enter Gemini API key in header (hidden until needed)
4. Pre-load "Alex Johnson" in the form
5. Clear screen — close Slack, notifications off

---

## The Pitch (5 Minutes)

---

### 🔴 [0:00 – 0:30] The Hook

> "Every day, millions of job applications are screened by AI systems. These systems make the first cut — they decide who gets an interview and who doesn't. But here's the question nobody's asking: **what if these systems are secretly discriminating?**"

*(pause)*

> "Today I'll show you bias happening in real time inside an AI — and then I'll eliminate it."

---

### 🔴 [0:30 – 1:45] Show the Problem

**Action:** Make sure "Alex Johnson" is loaded (male, Bachelor's, 5yr, 5 skills)

> "Meet Alex Johnson. Male name. Bachelor's degree. Five years experience. Five matching skills."

**Click Analyze**

> "The biased AI scores Alex at [X]/100 — HIRED."

**Action:** Click "Priya" in quick samples to load Priya Sharma (female, Master's, 6yr, same skills)

> "Now meet Priya Sharma. Female. Master's degree — *more educated* than Alex. Six years — *more experienced*. Same five technical skills."

**Click Analyze**

> "The biased AI scores Priya at [X]/100 — REJECTED."

*(pause for effect)*

> "More qualified. Better educated. More experience. **Rejected.** Because of her name and gender."

---

### 🔴 [1:45 – 2:45] The What-If Simulation

**Action:** Click the "🔬 What-If" tab

> "Here's where it gets powerful. Watch what happens when I give Priya a Western male name."

**Action:** In "Alternative Name" type "Alex Johnson", gender → Male. Click Run Simulation.

> "Same skills. Same degree. Same years of experience. I just changed the name and gender. The biased system jumped [X] points. The fair system? Zero change. It doesn't care about demographics."

*(if decision changed):*
> "And crucially — it changed her from REJECTED to HIRED. The AI was hiring the *name*, not the *person*."

---

### 🔴 [2:45 – 3:30] The Fix

**Action:** Click "📊 Compare" tab

> "Our Fair System strips out every protected attribute before scoring. Gender: zeroed out. Name perception: zeroed out. What's left? Pure merit — skills match, years of experience, education level."

*(point to comparison table)*

> "Look at this table. The biased system has two rows that should never exist in a real system: gender bias and name perception bias. Our fair system has those at zero. Legally, morally, and technically — that's what an ethical AI looks like."

---

### 🔴 [3:30 – 4:15] Google Gemini — Explainable AI

**Action:** Go back to "⚡ Analyze" tab, scroll down to Explanation Panel

> "Now here's something most AI systems completely lack: *explainability*. When an AI makes a decision, can it tell you *why*?"

**Action:** Click "✨ Get Gemini Explanation"

> "We use Google Gemini 1.5 Flash to generate a plain-English explanation of every single decision. Legal risk, real-world analogy, what changed — everything a hiring manager needs to audit the decision."

*(while Gemini loads):*
> "This is what compliance teams, regulators, and candidates deserve. Not a black-box score — an *explained* decision."

*(when result appears):*
> "There it is. AI explaining AI. That's Explainable AI."

---

### 🔴 [4:15 – 4:45] Statistics — Systemic Bias

**Action:** Click "📋 Statistics" tab

> "This isn't just one candidate. Across our full test dataset of 8 people with comparable qualifications — the biased system applied an average [X]-point penalty to female candidates. [N] out of 8 had their hiring decision *changed* by bias."

*(point to gender gap chart)*

> "This is systemic discrimination baked into an algorithm. Our Fairness Engine detects it, quantifies it, and eliminates it."

---

### 🔴 [4:45 – 5:00] Closing

> "We built this in [X] hours. The tech is real, the bias is real, and the solution works."

> "The AI Fairness Engine: detect bias, eliminate it, explain every decision. Fair AI starts here."

> "Thank you."

---

## Backup Talking Points (if asked questions)

**"How did you detect the bias?"**
> "We reverse-engineered how a biased system would work — injecting gender and name-perception weights based on real audit studies, including Bertrand and Mullainathan's famous 2004 research showing identical resumes with 'white-sounding' names got 50% more callbacks. We made the invisible visible."

**"Is this a real AI or just rules?"**
> "The bias engine and fair engine are rule-based for transparency and explainability — which is intentional. You can audit every point. The AI layer is Gemini, which provides human-readable analysis. In production, you'd layer this over any ML model as a bias detection wrapper."

**"How would this work in the real world?"**
> "This architecture wraps around any existing ATS — Workday, Greenhouse, Lever. You pipe candidate data through our API before scoring. The fair engine scores them, Gemini explains the decision, and a bias audit log is maintained for compliance."

**"What about loan approvals?"**
> "The architecture is domain-agnostic. The backend already has a loan domain scaffold. Swap out skill matching for debt-to-income ratio, credit score, employment history — same bias detection layer applies. Redlining by zip code is the loan equivalent of name bias in hiring."

**"Why does name bias exist?"**
> "Research shows recruiters unconsciously associate names with ethnicity and socioeconomic background. Our system detects when a model has learned this association from training data and corrects for it."

---

## Tech Stack Slide (if presenting slides)

```
Frontend    React 18 + Tailwind CSS + Recharts → Vercel
Backend     Node.js + Express → Render / Cloud Run
AI Layer    Google Gemini 1.5 Flash (XAI)
Scoring     Rule-based bias engine + fair engine
Compliance  EEOC, EU AI Act Art. 10, ISO/IEC 24027
```

---

## Judging Criteria Mapping

| Criterion | How We Address It |
|---|---|
| **Innovation** | Real-time bias comparison + What-If simulator |
| **Technical depth** | Dual scoring engine, XAI via Gemini, REST API |
| **Impact** | Solves real EEOC compliance problem |
| **UI/UX** | Professional dashboard, charts, real-time |
| **Google AI use** | Gemini for XAI, resume parsing, narrative |
| **Completeness** | Full-stack, deployed, documented |
| **Demo quality** | Live, interactive, shocking reveal moments |
