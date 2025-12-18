# 🏸 ProCourt – Complete Badminton Court Booking System

ProCourt is a full-stack badminton court booking platform that allows users to book courts, coaches, and equipment with **dynamic pricing**, **real-time availability**, and a **smart waitlisting system**.  
It also provides a powerful **admin dashboard** for managing resources, pricing rules, and bookings.

---

## 🌐 Live Application

**Frontend (UI):**  
https://badminton-court-booking-website.vercel.app/

**Backend (API):**  
https://badminton-court-booking-website.onrender.com

---

## 🌟 Features

### 👤 User Features
- Authentication – Secure JWT-based signup and login  
- Court Booking – Book indoor and outdoor badminton courts  
- Real-time Availability – Instant slot availability checks  
- Smart Waitlist – Join a queue when slots are full  
- Dynamic Pricing – Automatic pricing based on:
  - Indoor courts (+20%)
  - Peak hours (6 PM – 9 PM: +50%)
  - Weekends (+30%)
- Add-ons – Optional coach booking and equipment rental  
- Booking History – View confirmed, upcoming, and waitlisted bookings  
- Live Price Summary – Real-time price calculation before booking  

---

### 🛠️ Admin Features
- Dashboard Analytics – Overview of bookings, revenue, and resources  
- Court Management – Create, update, and delete courts  
- Coach Management – Manage coach availability and pricing  
- Equipment Management – Track rental equipment and stock  
- Waitlist Management – View and manage waitlist queues  
- Pricing Rules – Configure dynamic pricing multipliers  
- Booking Overview – View and manage all system bookings  

---

## ⏳ Smart Waitlist System

The system handles high-demand booking slots using a **priority-based waitlist**:

- **Join Waitlist:**  
  If a selected slot is unavailable, users can join the waitlist.

- **Queue Logic:**  
  Users are added on a **first-come, first-served basis** for each court and time slot.

- **Automatic Promotion:**  
  When a booking is cancelled, the next user in the queue is eligible to claim the slot.

---

## 🚀 Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Vite
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

## 📁 Project Structure

```text
BADMINTON_COURT_WEBSITE/
├── client/                 # Frontend (React + Vite)
├── routes/                 # API routes
├── src/
│   ├── application/        # Booking services
│   ├── domain/             # Pricing engine
│   └── infrastructure/     # MongoDB schemas
├── seed.js                 # Database seeding
├── server.js               # Express entry point
├── .env
└── README.md
🛠️ Setup & Installation
Prerequisites

Node.js (v14+)

MongoDB (local or Atlas)

npm

1️⃣ Clone Repository
git clone <repository-url>
cd BADMINTON_COURT_WEBSITE

2️⃣ Backend Setup
npm install


Create a .env file in the root directory:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/procourt
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development


Seed the database:

npm run seed


Start the backend server:

npm run dev


Backend runs on:
http://localhost:5000

3️⃣ Frontend Setup
cd client
npm install
npm run dev


Frontend runs on:
http://localhost:5173

🔐 Test Credentials

After running the seed script, use the following accounts:

console.log("Admin: admin@procourt.com / admin123");
console.log("User:  user@procourt.com / user123");

Admin Account

Email: admin@procourt.com

Password: admin123

Access: Full admin dashboard

User Account

Email: user@procourt.com

Password: user123

Access: Court booking, waitlist, and booking history

⚡ Quick Start (Local)
npm install
npm run seed
npm run dev

cd client
npm install
npm run dev


Open in browser:
👉 http://localhost:5173

📄 License

MIT License – Free to use for personal and commercial projects.

🏸 Built with ❤️ for Badminton Enthusiasts

Live App: https://badminton-court-booking-website.vercel.app/
