# FoodResQ 🍱

> Turn surplus food into meaningful impact — powered by 7 Next-Gen AI Engines.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-food--res--q--azure.vercel.app-00C7B7?style=for-the-badge&logo=vercel&logoColor=white)](https://food-res-q-azure.vercel.app/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)]()
[![Socket.IO](https://img.shields.io/badge/Real--time-Socket.IO-blue)]()
[![AI Engines](https://img.shields.io/badge/AI%20Engines-7%20Proprietary-purple)]()
[![Tamil Nadu](https://img.shields.io/badge/Region-Tamil%20Nadu-orange)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

FoodResQ is an **AI-powered food surplus redistribution platform** that connects restaurants, bakeries, and cafeterias across Tamil Nadu with NGOs and volunteers — redistributing surplus food before it expires.

🌐 **Live Website:** [https://food-res-q-azure.vercel.app/](https://food-res-q-azure.vercel.app/)  
📂 **GitHub Repository:** [https://github.com/ghkrknkp/FoodResQ](https://github.com/ghkrknkp/FoodResQ)

---

## 🎯 The Problem

- **1.3 billion tons** of food wasted annually
- **828 million people** face hunger worldwide
- **30%** of all food produced is wasted
- Tamil Nadu festival / hotel surplus goes unclaimed daily

---

## 🤖 AI Innovation Suite — 7 Proprietary Engines

### 1. 📸 Vision AI — "Snap-to-Donate"
`POST /api/ai/vision-analyze`

- Identifies Tamil Nadu dishes from photos (Pongal, Biryani, Sambar Sadham, Parotta)
- Estimates weight & portion counts automatically
- Evaluates visual freshness & flags allergens
- Auto-fills the listing form — zero typing needed

### 2. 🗣️ Tamil & English Voice Assistant
`POST /api/ai/voice-parse`

- Web Speech API (`ta-IN` / `en-IN`) — speak in Tamil or English
- NLP extracts: food name, quantity, category, expiry, location
- Tamil unicode support for cooks who cannot type
- Confidence scoring per field

### 3. ⏱️ Climate-Aware Dynamic Expiry Engine
`POST /api/ai/expiry-calculator`

- Tamil Nadu district climate profiles (Namakkal, Chennai, Madurai, Ooty, Coimbatore)
- Ambient temperature + humidity adjusts safe windows
- Emergency SOS trigger when window < 2 hours
- Room temp vs. refrigerated storage advice

### 4. 🎯 Smart NGO Matchmaker & Route Dispatcher
`POST /api/ai/ngo-matcher`

- Capacity-aware matching to orphanages, shelters, old-age homes
- Multi-stop route planning with distance (km) + ETA
- 15+ Tamil Nadu NGOs across Namakkal, Salem, Dharmapuri

### 5. 🛡️ FSSAI Food Safety Guard & Digital QR Pass
`POST /api/ai/safety-verify`

- 5°C–60°C bacterial danger zone evaluation
- FSSAI hygiene compliance scoring
- Digital QR Safety Pass for pickup verification
- Risk indicators: Safe ✅ / Warning ⚠️ / Danger 🚫

### 6. 📜 Auto ESG & Green Carbon Offset Certificate
`POST /api/ai/esg-report`

- CO₂ avoided (0.52 kg CO₂ per kg rescued)
- Water footprint saved calculation
- Downloadable Green Sustainability Certificate
- 80G CSR tax compliance ready

### 7. 🔮 Predictive Kitchen Waste Prevention Advisor
`GET /api/ai/waste-forecast`

- Day-of-week demand patterns
- Rainy day footfall drop predictions
- Tamil festival calendar (Pongal, Deepavali, Navratri)
- Pre-cooking quantity advisor

### 8. 📊 Demand & Peak Timing Insights
`GET /api/ai/demand-insights`

- 30-day MongoDB historical claim rates
- Peak claim hour heatmap
- Category success rate analysis

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, React Router v6, Recharts |
| Backend | Node.js, Express.js, Socket.IO, JWT, bcrypt, Multer |
| Database | MongoDB + Mongoose (Atlas / local) |
| Real-time | Socket.IO WebSockets |
| AI | Simulated engines (Gemini API integration ready) |
| Deploy | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## 🚀 Quick Start

```bash
git clone https://github.com/ghkrknkp/FoodResQ.git
cd FoodResQ
npm install && cd client && npm install && cd ../server && npm install && cd ..
cp .env.example server/.env
# Edit server/.env — set MONGODB_URI and JWT_SECRET
npm run dev
# Open http://localhost:5173
```

---

## 🌐 Deploy: Vercel (Frontend) + Render (Backend)

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "Deploy: complete FoodResQ with 7 AI engines"
git push origin main
```

### Step 2 — Deploy Backend on Render
1. Go to https://render.com → **New Web Service**
2. Connect GitHub → select `ghkrknkp/FoodResQ`
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Region:** Singapore
4. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=<your MongoDB Atlas URI>
   JWT_SECRET=<your 64-char random secret>
   CORS_ORIGIN=https://<your-app>.vercel.app
   PORT=10000
   ```
5. Click **Deploy** — copy your Render URL: `https://foodresq-api.onrender.com`

### Step 3 — Deploy Frontend on Vercel
1. Go to https://vercel.com → **New Project**
2. Import `ghkrknkp/FoodResQ` from GitHub
3. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://foodresq-api.onrender.com/api
   ```
5. Click **Deploy** — your app is live! 🎉

### Step 4 — Update CORS on Render
Go back to Render → Environment → update:
```
CORS_ORIGIN=https://food-res-q-azure.vercel.app
```
Trigger a redeploy.

---

## 📊 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (Restaurant/NGO/Volunteer) |
| POST | `/api/auth/login` | Login — returns JWT |
| GET | `/api/auth/me` | Current user profile |

### Food
| Method | Endpoint | Role |
|--------|----------|------|
| GET | `/api/food` | Public |
| POST | `/api/food` | Restaurant |
| GET | `/api/food/:id` | Public |
| PUT | `/api/food/:id` | Restaurant (own) |
| DELETE | `/api/food/:id` | Restaurant (own) |

### AI Engines
| Method | Endpoint | What It Does |
|--------|----------|-------------|
| POST | `/api/ai/vision-analyze` | Photo → dish + portions + freshness |
| POST | `/api/ai/voice-parse` | Speech → listing fields |
| POST | `/api/ai/expiry-calculator` | Weather + food → safe window |
| POST | `/api/ai/ngo-matcher` | Location → NGO matches + routes |
| POST | `/api/ai/safety-verify` | Food data → FSSAI audit + QR |
| POST | `/api/ai/esg-report` | kg rescued → CO₂ + certificate |
| GET | `/api/ai/waste-forecast` | Day + weather → cook-less advice |
| POST | `/api/ai/listing-assistant` | Text → enhanced title + tags |
| GET | `/api/ai/demand-insights` | DB aggregate → peak windows |

---

## 📁 Project Structure

```
FoodResQ/
├── client/                  # React + Vite (deploy to Vercel)
│   ├── src/
│   │   ├── components/ai/   # 8 AI panel components
│   │   ├── pages/ai/        # AiInnovationHub.jsx
│   │   └── ...
│   ├── vercel.json          # SPA routing fallback
│   └── vite.config.js
├── server/                  # Express API (deploy to Render)
│   └── src/
│       ├── controllers/aiController.js  # All AI engines
│       ├── routes/aiRoutes.js
│       └── ...
├── render.yaml              # Render deployment config
├── .env.example             # Env variable template
└── README.md
```

---

## 🔮 Roadmap

- ✅ Phase 1: Core platform (auth, listings, claims, real-time)
- ✅ Phase 2: 7 AI engines, analytics dashboards, Tamil Nadu explorer
- 🔮 Phase 3: React Native mobile, WhatsApp notifications, live GPS, Gemini API live

---

**FoodResQ** — Turn surplus food into meaningful impact! 🍱🤝🌱

*Built for Tamil Nadu food rescue with MERN + Socket.IO + 7 AI Engines*
