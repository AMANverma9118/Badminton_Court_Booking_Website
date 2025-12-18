# 🏸 ProCourt - Complete Badminton Court Booking System

A full-stack modern web application for booking badminton courts, coaches, and equipment with real-time pricing, availability checks, and comprehensive admin management.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Test Credentials](#-test-credentials)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

## 🌟 Features

### User Features
- ✅ **Authentication**: Secure JWT-based signup/login
- ✅ **Court Booking**: Browse and book indoor/outdoor courts
- ✅ **Real-time Availability**: Check slot availability instantly
- ✅ **Dynamic Pricing**: Automatic calculation based on:
  - Court type (Indoor: +20%)
  - Peak hours (6 PM - 9 PM: +50%)
  - Weekend (Sat/Sun: +30%)
- ✅ **Add-ons**: Optional coach and equipment rental
- ✅ **Booking History**: View all past and upcoming bookings
- ✅ **Live Price Summary**: Real-time price breakdown

### Admin Features
- 📊 **Dashboard**: Overview statistics and analytics
- 🏟️ **Court Management**: Full CRUD operations
- 👨‍🏫 **Coach Management**: Manage coaches and availability
- 🎾 **Equipment Management**: Track rental equipment
- 💰 **Pricing Rules**: Configure dynamic pricing
- 📅 **Booking Overview**: View all system bookings

## 🚀 Tech Stack

### Frontend (client/)
- **React 18** - Modern UI library with Hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool

### Backend (src/)
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
BADMINTON_COURT_WEBSITE/
├── client/                          # Frontend React Application
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.jsx        # Login & Signup UI
│   │   │   ├── UserDashboard.jsx   # User booking interface
│   │   │   ├── AdminDashboard.jsx  # Admin management panel
│   │   │   └── Forms.jsx           # Admin CRUD forms
│   │   ├── hooks/
│   │   │   ├── useAuth.js          # Authentication logic
│   │   │   └── useApi.js           # API calls & data fetching
│   │   ├── utils/
│   │   │   ├── api.js              # API configuration
│   │   │   └── helpers.js          # Helper functions
│   │   ├── App.css
│   │   ├── App.jsx                 # Main app component
│   │   ├── index.css
│   │   └── main.jsx                # App entry point
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
├── node_modules/                    # Backend dependencies
├── routes/
│   ├── admin.js                    # Admin routes
│   └── auth.js                     # Authentication routes
├── src/                            # Backend Application
│   ├── application/
│   │   └── BookingService.js       # Booking business logic
│   ├── domain/
│   │   └── PricingEngine.js        # Pricing calculation engine
│   └── infrastructure/
│       └── models/
│           └── Schemas.js          # MongoDB schemas
├── .env                            # Environment variables
├── .gitignore
├── package-lock.json
├── package.json
├── README.md                       # This file
├── seed.js                         # Database seeding script
└── server.js                       # Express server entry point
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd BADMINTON_COURT_WEBSITE
```

### Step 2: Backend Setup

```bash
# Install backend dependencies (in root directory)
npm install

# Create .env file in root directory
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/procourt
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
EOF

# Start MongoDB (if using local MongoDB)
# Windows: Start MongoDB service
# Mac/Linux: mongod

# Seed the database with sample data
npm run seed

# Start backend server
npm run dev
```

**Backend running on:** `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Open new terminal and navigate to client folder
cd client

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```

**Frontend running on:** `http://localhost:5173`

## 🔐 Test Credentials

After running `npm run seed` in the root directory, use these credentials to test the application:

### Admin Account
```
Email: admin@procourt.com
Password: admin123
```
**Access:** Full admin dashboard with ability to manage all resources (courts, coaches, equipment, pricing rules)

### User Account
```
Email: user@procourt.com
Password: user123
```
**Access:** Book courts, add coaches and equipment, view booking history

### Sample Data Seeded
- ✅ **4 Courts**: 
  - Court 1 (Indoor) - ₹20/hr
  - Court 2 (Indoor) - ₹20/hr
  - Court 3 (Outdoor) - ₹15/hr
  - Court 4 (Outdoor) - ₹15/hr
- ✅ **3 Coaches**: 
  - Coach Anjali - ₹30/hr (Advanced Training)
  - Coach Vikram - ₹25/hr (Beginners)
  - Coach David - ₹35/hr (Professional)
- ✅ **2 Equipment**: 
  - Professional Racket - ₹5/hr (10 in stock)
  - Court Shoes - ₹4/hr (8 in stock)
- ✅ **3 Pricing Rules**: 
  - Peak Hours (6-9 PM): +50%
  - Weekend: +30%
  - Indoor Premium: +20%

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Signin
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@procourt.com",
  "password": "user123"
}

Response: {
  "token": "jwt_token_here",
  "user": { ... }
}
```

### User Endpoints (Requires Authentication)

#### Get Available Resources
```http
GET /api/resources
Authorization: Bearer <token>

Response: {
  "courts": [...],
  "coaches": [...],
  "equipment": [...]
}
```

#### Create Booking
```http
POST /api/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "userName": "John Doe",
  "courtId": "court_id",
  "coachId": "coach_id", // optional
  "equipment": [
    { "itemId": "equipment_id", "quantity": 1 }
  ],
  "startTime": "2024-01-15T18:00:00",
  "totalPrice": 1570
}
```

#### Get Booking History
```http
GET /api/history
Authorization: Bearer <token>

Response: [
  {
    "_id": "booking_id",
    "courtId": { "name": "Court 1", ... },
    "userName": "John Doe",
    "startTime": "2024-01-15T18:00:00",
    "totalPrice": 1570,
    "status": "confirmed"
  }
]
```

#### Check Availability
```http
POST /api/check-availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "courtId": "court_id",
  "startTime": "2024-01-15T18:00:00"
}

Response: {
  "available": true
}
```

### Admin Endpoints (Requires Admin Token)

#### Dashboard Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>

Response: {
  "totalBookings": 150,
  "totalRevenue": 250000,
  "activeCourts": 10,
  "activeCoaches": 5
}
```

#### Courts Management
```http
GET    /api/admin/courts           # Get all courts
POST   /api/admin/courts           # Create court
PUT    /api/admin/courts/:id       # Update court
DELETE /api/admin/courts/:id       # Delete court
```

**Example - Create Court:**
```http
POST /api/admin/courts
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Court 5",
  "type": "indoor",
  "basePrice": 25,
  "isActive": true
}
```

#### Coaches Management
```http
GET    /api/admin/coaches          # Get all coaches
POST   /api/admin/coaches          # Create coach
PUT    /api/admin/coaches/:id      # Update coach
DELETE /api/admin/coaches/:id      # Delete coach
```

#### Equipment Management
```http
GET    /api/admin/equipment        # Get all equipment
POST   /api/admin/equipment        # Create equipment
PUT    /api/admin/equipment/:id    # Update equipment
DELETE /api/admin/equipment/:id    # Delete equipment
```

#### Pricing Rules
```http
GET    /api/admin/pricing-rules       # Get all rules
POST   /api/admin/pricing-rules       # Create rule
PUT    /api/admin/pricing-rules/:id   # Update rule
DELETE /api/admin/pricing-rules/:id   # Delete rule
```

#### All Bookings
```http
GET /api/admin/bookings
Authorization: Bearer <admin_token>
```

## 💰 Pricing Calculation

### Formula
```javascript
basePrice = court.basePrice

// Apply multipliers from pricing rules
if (courtType === 'indoor') basePrice *= 1.2        // +20%
if (hour >= 18 && hour < 21) basePrice *= 1.5       // +50% peak
if (isWeekend) basePrice *= 1.3                     // +30% weekend

totalPrice = basePrice + coachFee + equipmentFee
```

### Example Calculation
**Scenario:**
- Court: Indoor (₹20/hr)
- Time: 7:00 PM (Peak hours)
- Day: Saturday (Weekend)
- Coach: Anjali (₹30/hr)
- Equipment: Racket (₹5/hr)

**Calculation:**
```
Base Price:     ₹20
Indoor (+20%):  ₹20 × 1.2 = ₹24
Peak (+50%):    ₹24 × 1.5 = ₹36
Weekend (+30%): ₹36 × 1.3 = ₹46.80
Coach:          +₹30
Equipment:      +₹5
─────────────────────────
Total:          ₹81.80
```

## 🗄️ Database Schemas

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  createdAt: Date
}
```

### Court
```javascript
{
  name: String,
  type: 'indoor' | 'outdoor',
  basePrice: Number,
  isActive: Boolean,
  createdAt: Date
}
```

### Coach
```javascript
{
  name: String,
  hourlyRate: Number,
  isAvailable: Boolean,
  specialization: String,
  createdAt: Date
}
```

### Equipment
```javascript
{
  name: String,
  totalStock: Number,
  hourlyRate: Number,
  isAvailable: Boolean,
  createdAt: Date
}
```

### Booking
```javascript
{
  userId: ObjectId (ref: User),
  userName: String,
  courtId: ObjectId (ref: Court),
  coachId: ObjectId (ref: Coach),
  equipment: [{ itemId: ObjectId, quantity: Number }],
  startTime: Date,
  totalPrice: Number,
  status: 'confirmed' | 'cancelled',
  createdAt: Date
}
```

### PricingRule
```javascript
{
  name: String,
  ruleType: 'peak' | 'weekend' | 'indoor_premium' | 'custom',
  multiplier: Number,
  isActive: Boolean,
  description: String,
  createdAt: Date
}
```

## 🧪 Testing the Application

### Quick Test Flow

1. **Start Both Servers**
   ```bash
   # Terminal 1 - Backend (from root directory)
   npm run dev
   
   # Terminal 2 - Frontend (from root directory)
   cd client
   npm run dev
   ```

2. **Test User Flow**
   - Go to `http://localhost:5173`
   - Login with: `user@procourt.com` / `user123`
   - Click "New Booking"
   - Select a court, date, and time
   - Optionally add coach and equipment
   - See live price calculation
   - Click "Confirm Booking"
   - View in "My Bookings"

3. **Test Admin Flow**
   - Logout and login with: `admin@procourt.com` / `admin123`
   - View dashboard statistics
   - Add a new court
   - Manage coaches and equipment
   - View all bookings

### Using Postman/Thunder Client

**Quick Import Collection:**

1. **Signup Request**
   ```
   POST http://localhost:5000/api/auth/signup
   Body: { "name": "Test", "email": "test@test.com", "password": "123456" }
   ```

2. **Signin Request**
   ```
   POST http://localhost:5000/api/auth/signin
   Body: { "email": "user@procourt.com", "password": "user123" }
   ```

3. **Get Resources** (Copy token from signin response)
   ```
   GET http://localhost:5000/api/resources
   Headers: Authorization: Bearer YOUR_TOKEN
   ```

## 🚢 Deployment

### Backend Deployment (Render)

1. **Create Render Account** at render.com

2. **Create New Web Service**
   - Connect your GitHub repository
   - Root Directory: Leave empty (backend is in root)
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/procourt
   JWT_SECRET=your_production_secret_key_min_32_characters
   NODE_ENV=production
   PORT=5000
   ```

4. **Deploy** - Render will auto-deploy on git push

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from client directory**
   ```bash
   cd client
   vercel
   ```

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables in Vercel Dashboard**
   ```
   VITE_API_URL=https://your-backend.render.com/api
   ```

5. **Update API URL** in `client/src/utils/api.js`
   ```javascript
   export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   ```

### Alternative: Deploy Both on Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy Backend** (from root)
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Deploy Frontend** (from client/)
   ```bash
   cd client
   railway init
   railway up
   ```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```bash
# Windows - Check MongoDB service
services.msc
# Look for MongoDB service and start it

# Mac/Linux - Start MongoDB
mongod
# Or
sudo systemctl start mongodb

# For MongoDB Atlas, verify connection string in .env
```

**Port 5000 Already in Use**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

**Seed Script Not Working**
```bash
# Make sure you're in root directory
cd BADMINTON_COURT_WEBSITE

# Run seed script
npm run seed

# If still fails, check MongoDB connection
# Verify MONGODB_URI in .env
```

**JWT Token Invalid**
- Ensure JWT_SECRET in .env is at least 32 characters
- Check token format: `Authorization: Bearer <token>`
- Token must not have expired

### Frontend Issues

**CORS Error**
```javascript
// In server.js (root directory), ensure:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

**API Connection Failed**
- Check backend is running on port 5000
- Verify API_URL in `client/src/utils/api.js`
- Open browser console (F12) for detailed errors

**Dependencies Not Installing**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Vite Port Already in Use**
```bash
# Frontend will automatically use next available port
# Or specify port in client/vite.config.js:
export default {
  server: { port: 3000 }
}
```

### Database Issues

**Collections Not Found**
```bash
# Re-run seed script from root directory
npm run seed
```

**Cannot Drop Database**
```bash
# Using MongoDB Compass or mongo shell:
mongo
use procourt
db.dropDatabase()

# Then re-seed
npm run seed
```

**Mongoose Connection Warning**
```bash
# Add to MONGODB_URI in .env:
mongodb://localhost:27017/procourt?retryWrites=true&w=majority
```

## 📊 Performance Tips

### Backend Optimization

**Add Database Indexes** in `src/infrastructure/models/Schemas.js`
```javascript
CourtSchema.index({ name: 1, type: 1 });
BookingSchema.index({ startTime: 1, courtId: 1 });
BookingSchema.index({ userId: 1, createdAt: -1 });
```

**Enable Compression** in `server.js`
```javascript
const compression = require('compression');
app.use(compression());
```

**Add Rate Limiting** in `server.js`
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### Frontend Optimization

**Lazy Loading** in `client/src/App.jsx`
```javascript
import { lazy, Suspense } from 'react';

const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

// In render:
<Suspense fallback={<div>Loading...</div>}>
  <UserDashboard />
</Suspense>
```

**React Memo for Expensive Components**
```javascript
export const PriceSummary = React.memo(({ breakdown, price }) => {
  // Component code
});
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit .env to Git (already in .gitignore)
2. **JWT Secret**: Use strong, random secret (32+ characters) in production
3. **Password Policy**: Enforce minimum 8 characters, mix of letters/numbers
4. **Rate Limiting**: Prevent brute force attacks on login
5. **Input Validation**: Validate all user inputs on backend
6. **HTTPS**: Always use HTTPS in production
7. **CORS**: Configure CORS properly for production domain
8. **Dependencies**: Regularly update dependencies for security patches

## 📝 NPM Scripts

### Backend (Root Directory)
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node seed.js"
}
```

### Frontend (Client Directory)
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

## 📄 License

MIT License - Free to use for personal and commercial projects

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@procourt.com

## 🙏 Acknowledgments

- React Team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for flexible data storage
- Express.js for robust API framework
- Vite for blazing fast development

---

## 🚀 Quick Start Commands

```bash
# 1. Install backend dependencies (root directory)
npm install

# 2. Create .env and add MongoDB URI & JWT Secret
# 3. Seed database
npm run seed

# 4. Start backend
npm run dev

# 5. In new terminal - Install frontend dependencies
cd client
npm install

# 6. Start frontend
npm run dev

# 7. Open browser: http://localhost:5173
# 8. Login with: user@procourt.com / user123
```

---

**Built with ❤️ for badminton enthusiasts! 🏸**

**Ready to play? Start both servers and visit http://localhost:5173**