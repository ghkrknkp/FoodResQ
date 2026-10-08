# FoodResQ

> Turn surplus food into meaningful impact.

FoodResQ is a food surplus redistribution platform that connects restaurants, bakeries, cafeterias, and other food providers with NGOs and volunteers to redistribute surplus food before it expires.

## 🎯 Problem

Food waste is a critical global issue while millions face food insecurity. Surplus food from restaurants and food providers often goes to waste when it could feed those in need.

## ✨ Solution

FoodResQ bridges the gap by providing a platform where:
- **Restaurants** can list surplus food with expiry tracking
- **NGOs and Volunteers** can browse and claim available food
- **Real-time notifications** ensure quick response times
- **Smart workflows** manage quantities and pickup status

## 🚀 Features

### Core Features
- ✅ Role-based authentication (Restaurant, NGO, Volunteer, Admin)
- ✅ Food listing creation with expiry tracking
- ✅ Advanced search and filtering
- ✅ Claim workflow with quantity management
- ✅ Real-time notifications via Socket.IO
- ✅ Role-specific dashboards with analytics
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Expiry monitoring and automatic status updates

### User Roles

**🍽️ Restaurant**
- Create and manage food listings
- Track claims and pickups
- View donation analytics
- Receive real-time claim notifications

**🤝 NGO / Volunteer**
- Browse available food donations
- Search and filter by location, category, expiry
- Claim food with quantity selection
- Track pickup status
- Receive status update notifications

**👨‍💼 Admin**
- Platform-wide analytics and monitoring
- User management overview
- Activity tracking
- Impact metrics visualization

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (supports local & Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Socket.IO** - Real-time WebSocket communication
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logging

## 📋 Prerequisites

- **Node.js** >= 16.x
- **npm** >= 8.x
- **MongoDB** (local installation OR MongoDB Atlas account)

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition:
   - **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow [official instructions](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. Start MongoDB service:
   ```bash
   # Windows (as service - usually auto-starts)
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. Use this connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/foodresq
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Whitelist your IP address (0.0.0.0/0 for development)
5. Get your connection string from "Connect" → "Connect your application"
6. Use this format in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodresq
   ```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ghkrknkp/FoodResQ.git
   cd FoodResQ
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `server` directory:
   ```bash
   cp .env.example server/.env
   ```
   
   Edit `server/.env` and configure:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Generate a secure random string (min 32 characters)
   - Other configuration as needed

4. **Generate secure JWT secret**
   ```bash
   # Node.js method
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## 🚀 Running the Application

### Development Mode

**Run both client and server concurrently:**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 (Server):
```bash
npm run server
```

Terminal 2 (Client):
```bash
npm run client
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Mode

1. **Build the client**
   ```bash
   npm run build
   ```

2. **Set environment to production**
   ```bash
   # In server/.env
   NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
FoodResQ/
├── client/                 # React frontend
│   ├── src/
│   │   ├── assets/        # Images, SVGs, icons
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route configuration
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Root component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── validators/   # Input validation
│   │   ├── utils/        # Utility functions
│   │   ├── app.js        # Express app setup
│   │   └── server.js     # Server entry point
│   └── package.json
│
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Root package.json
└── README.md           # This file
```

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Food Listing Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/food` | Get all food listings (with filters) | No | All |
| POST | `/api/food` | Create food listing | Yes | Restaurant |
| GET | `/api/food/:id` | Get single food listing | No | All |
| PUT | `/api/food/:id` | Update food listing | Yes | Restaurant (own) |
| DELETE | `/api/food/:id` | Delete food listing | Yes | Restaurant (own) |

### Claim Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/food/:id/claims` | Claim food | Yes | NGO, Volunteer |
| GET | `/api/claims` | Get user's claims | Yes | All |
| GET | `/api/claims/:id` | Get claim details | Yes | All (own) |
| PUT | `/api/claims/:id` | Update claim status | Yes | All (own) |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get user notifications | Yes |
| PUT | `/api/notifications/:id/read` | Mark as read | Yes |
| PATCH | `/api/notifications/read-all` | Mark all as read | Yes |

### Dashboard Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/dashboard/restaurant` | Restaurant analytics | Yes | Restaurant |
| GET | `/api/dashboard/ngo` | NGO/Volunteer analytics | Yes | NGO, Volunteer |
| GET | `/api/dashboard/admin` | Admin analytics | Yes | Admin |

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/foodresq` |
| `JWT_SECRET` | JWT signing secret | `your_secure_random_string` |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173` |

## 🔌 Socket.IO Events

### Server → Client Events

| Event | Description | Data |
|-------|-------------|------|
| `food:created` | New food listing created | Food listing object |
| `food:updated` | Food listing updated | Updated food listing |
| `food:claimed` | Food listing claimed | Claim details |
| `food:expired` | Food listing expired | Food listing ID |
| `claim:updated` | Claim status updated | Updated claim |
| `notification:new` | New notification | Notification object |

## 🧪 Testing

### Test User Registration Flow
1. Navigate to http://localhost:5173/register
2. Register as Restaurant with organization details
3. Login and create food listing
4. Register second user as NGO
5. Browse food and claim listing
6. Verify real-time notifications

### Test Complete Workflow
1. **Restaurant**: Create listing with expiry time
2. **NGO**: Browse, search, filter food
3. **NGO**: Claim partial quantity
4. **Restaurant**: Verify notification received
5. **NGO**: Update claim status to PICKUP_PENDING
6. **NGO**: Update to COLLECTED
7. **Both**: Verify analytics updated

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: `MongoNetworkError`**
- Ensure MongoDB service is running
- Check connection string format
- For Atlas: Verify IP whitelist and credentials

**Error: `Authentication failed`**
- Verify username and password in connection string
- Check database user permissions

### Port Already in Use

```bash
# Kill process on port 5000 (server)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Cannot Connect to Backend

- Verify server is running on correct port
- Check `CLIENT_URL` in server `.env`
- Verify CORS configuration
- Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Development

FoodResQ is built as a comprehensive MERN stack application demonstrating:
- Full-stack JavaScript development
- Real-time communication with WebSocket
- Role-based access control
- RESTful API design
- Responsive UI/UX design
- Database modeling and relationships
- Security best practices

---

**FoodResQ** - Turn surplus food into meaningful impact. 🍱🤝🌱
