# FoodResQ - Quick Start Guide

## Get Up and Running in 5 Minutes

### Step 1: Install Dependencies (2 min)

```bash
# Install all dependencies for root, client, and server
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### Step 2: Setup MongoDB (1 min)

**Option A: Use MongoDB Atlas (Recommended - No installation needed)**
1. Go to mongodb.com/cloud/atlas
2. Create free account & cluster
3. Get connection string
4. Update `server/.env`: 
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodresq
   ```

**Option B: Use Local MongoDB**
- Ensure MongoDB is installed and running
- Default connection string in `server/.env` will work:
  ```
  MONGODB_URI=mongodb://localhost:27017/foodresq
  ```

### Step 3: Start the Application (1 min)

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

Wait for: `MongoDB Connected` and `Server running on port 5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### Step 4: Open and Test (1 min)

1. Open browser: http://localhost:5173
2. Click "Sign Up"
3. Register as Restaurant
4. Create a food listing
5. Open another browser/incognito
6. Register as NGO
7. Browse and claim the food
8. See real-time notification! 🎉

---

## That's It!

You now have FoodResQ running locally with:
- ✅ Backend API on port 5000
- ✅ Frontend on port 5173
- ✅ Real-time notifications via Socket.IO
- ✅ MongoDB connected
- ✅ All features functional

---

## Quick Commands

```bash
# Start both servers at once (from root directory)
npm run dev

# Server only
npm run server

# Client only
npm run client

# Install everything
npm run install:all
```

---

## Test Accounts

After registration, you can create test accounts:

**Restaurant:**
- Email: restaurant@test.com
- Password: password123
- Role: Restaurant

**NGO:**
- Email: ngo@test.com  
- Password: password123
- Role: NGO

**Volunteer:**
- Email: volunteer@test.com
- Password: password123
- Role: Volunteer

---

## Common Issues

**"Cannot connect to MongoDB"**
- Ensure MongoDB is running (if local)
- Check connection string in `server/.env`
- For Atlas: verify IP whitelist and credentials

**"Port already in use"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**"Module not found"**
```bash
npm run install:all
```

---

## Next Steps

- Read [README.md](README.md) for complete documentation
- Follow [TEST_WORKFLOW.md](TEST_WORKFLOW.md) for testing
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

---

**Need Help?**
- Check server terminal for backend errors
- Check browser console for frontend errors
- Ensure both terminals show "running" status
- Verify MongoDB connection message appears

---

**FoodResQ** - Turn surplus food into meaningful impact! 🍱
