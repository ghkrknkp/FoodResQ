# FoodResQ — Deployment Guide 🚀

Deploy FoodResQ for **FREE** using:
- 🔵 **MongoDB Atlas** — Free cloud database
- 🟣 **Render** — Free backend API hosting
- ▲ **Vercel** — Free frontend hosting

---

## Prerequisites

- GitHub account with the repo pushed: https://github.com/ghkrknkp/FoodResQ
- MongoDB Atlas account (free): https://www.mongodb.com/cloud/atlas
- Render account (free): https://render.com
- Vercel account (free): https://vercel.com

---

## Step 1 — Set Up MongoDB Atlas

1. Go to https://cloud.mongodb.com → **Create a free account**
2. Click **Build a Database** → Choose **FREE (M0 Sandbox)**
3. Select region: **AWS / Mumbai (ap-south-1)** (closest to Tamil Nadu)
4. Click **Create**
5. Create a database user:
   - Username: `foodresq`
   - Password: generate a strong password, save it
6. In **Network Access** → **Add IP Address** → `0.0.0.0/0` (Allow from anywhere)
7. Click **Connect** → **Connect your application**
8. Copy the connection string — it looks like:
   ```
   mongodb+srv://foodresq:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `<password>` with your password and add database name:
   ```
   mongodb+srv://foodresq:yourpassword@cluster0.xxxxx.mongodb.net/foodresq?retryWrites=true&w=majority
   ```

---

## Step 2 — Generate a JWT Secret

Run this in your terminal (or any Node.js environment):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output — you'll use it as `JWT_SECRET`.

---

## Step 3 — Push Code to GitHub

```bash
cd c:\Users\sarin\Downloads\FoodResQ

git add .
git commit -m "Deploy: FoodResQ with 7 AI engines + deployment config"
git push origin main
```

---

## Step 4 — Deploy Backend on Render

1. Go to https://render.com → **Sign In / Sign Up**
2. Click **New +** → **Web Service**
3. Click **Connect a repository** → Select `ghkrknkp/FoodResQ`
4. Fill in settings:

| Setting | Value |
|---|---|
| **Name** | `foodresq-api` |
| **Region** | Singapore |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

5. Scroll down to **Environment Variables** → Add these:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | `mongodb+srv://...` (from Step 1) |
| `JWT_SECRET` | (your 128-char hex from Step 2) |
| `JWT_EXPIRE` | `7d` |
| `CORS_ORIGIN` | `https://foodresq.vercel.app` (update after Step 5) |

6. Click **Create Web Service**
7. Wait 3-5 minutes for the first deploy
8. **Copy your Render URL** — e.g., `https://foodresq-api.onrender.com`
9. Test it: visit `https://foodresq-api.onrender.com/api/health`
   - You should see: `{"success":true,"message":"Server is running"}`

---

## Step 5 — Deploy Frontend on Vercel

1. Go to https://vercel.com → **Sign In**
2. Click **New Project**
3. Click **Import Git Repository** → Select `ghkrknkp/FoodResQ`
4. Configure the project:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

5. Click **Environment Variables** → Add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://foodresq-api.onrender.com/api` |

6. Click **Deploy**
7. Wait 2-3 minutes
8. **Copy your Vercel URL** — e.g., `https://foodresq.vercel.app`

---

## Step 6 — Update CORS on Render

Now that you know your Vercel URL, go back to Render:

1. Open your `foodresq-api` service on Render
2. Go to **Environment** tab
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://foodresq.vercel.app
   ```
   (Replace with your actual Vercel URL)
4. Click **Save Changes** — Render will automatically redeploy

---

## Step 7 — Verify Everything Works

1. Visit your Vercel URL: `https://foodresq.vercel.app`
2. Register a Restaurant account
3. Create a food listing
4. Register an NGO account
5. Claim the food listing
6. Check real-time notifications work
7. Visit `/ai-hub` to test all 7 AI engines

---

## Environment Variables Reference

### server/.env (for local development)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodresq
JWT_SECRET=your_local_secret_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=
```

### Render Environment Variables (production)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<your 128-char secret>
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-app.vercel.app
```

### Vercel Environment Variables (production)
```env
VITE_API_URL=https://foodresq-api.onrender.com/api
```

---

## Troubleshooting

### ❌ "CORS error" in browser console
- Go to Render → Environment → update `CORS_ORIGIN` to exact Vercel URL (no trailing slash)
- Trigger a manual redeploy on Render

### ❌ "MongoDB connection failed"
- Check Atlas Network Access — ensure `0.0.0.0/0` is allowed
- Verify the connection string has the correct password and database name

### ❌ "Page not found" on Vercel for routes like `/browse`, `/ai-hub`
- The `client/vercel.json` file handles this — ensure it was committed to GitHub:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

### ❌ Render backend sleeping (free tier)
- Free Render services sleep after 15 min of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Use UptimeRobot (free) to ping `/api/health` every 14 min to keep awake

### ❌ Vercel build fails
- Ensure Root Directory is set to `client` (not the repo root)
- Check that `client/package.json` exists and has a `build` script

---

## Custom Domain (Optional)

### Vercel Custom Domain
1. Vercel Dashboard → Project → **Settings** → **Domains**
2. Add your domain (e.g., `foodresq.in`)
3. Update DNS records as instructed

### After Adding Custom Domain
Update `CORS_ORIGIN` on Render to your custom domain:
```
CORS_ORIGIN=https://foodresq.in
```

---

## Production Checklist

- [ ] MongoDB Atlas cluster created with Mumbai region
- [ ] Database user created with strong password
- [ ] Network access allows `0.0.0.0/0`
- [ ] Render service deployed with all env variables
- [ ] `/api/health` returns 200 OK
- [ ] Vercel deployed with `VITE_API_URL` pointing to Render
- [ ] `CORS_ORIGIN` on Render matches exact Vercel URL
- [ ] Registration and login work
- [ ] Food listing creation works
- [ ] AI Hub (`/ai-hub`) loads all 7 engines
- [ ] Real-time notifications work

---

*FoodResQ — Free production deployment in under 30 minutes!* 🍱🚀
