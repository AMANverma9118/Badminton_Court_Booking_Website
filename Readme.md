🏸 ProCourt – Badminton Court Booking System

ProCourt is a full-stack web application that enables users to book badminton courts with dynamic pricing, optional coaches and equipment, and a smart waitlisting system for high-demand slots.
It also provides a powerful admin dashboard for managing resources and bookings.

🌐 Live Application

Frontend (UI):
https://badminton-court-booking-website.vercel.app/

Backend (API):
https://badminton-court-booking-website.onrender.com

🌟 Features
👤 User Features

Authentication – Secure JWT-based signup and login

Court Booking – Book indoor and outdoor badminton courts

Smart Waitlist – Join a waitlist automatically when slots are full

Real-time Availability – Instant slot availability checks

Dynamic Pricing – Automatic price calculation based on:

Indoor courts (+20%)

Peak hours: 6 PM – 9 PM (+50%)

Weekends (+30%)

Add-ons – Optional coach booking and equipment rental

Booking History – View confirmed, upcoming, and waitlisted bookings

Live Price Summary – Real-time pricing breakdown before confirmation

🛠️ Admin Features

Dashboard Analytics – Overview of bookings, revenue, and resources

Resource Management – Full CRUD for courts, coaches, and equipment

Waitlist Management – Monitor and manage queues for popular slots

Pricing Rules – Configure and manage dynamic pricing multipliers

Booking Overview – View and manage all user bookings

⏳ Smart Waitlist System

To handle high-demand booking periods, ProCourt includes a priority-based waitlist:

Join Waitlist:
When a selected slot is unavailable, users can opt to join the waitlist.

Queue Logic:
Waitlists are maintained on a first-come, first-served basis for each court and time slot.

Automatic Promotion:
If a booking is cancelled, the next eligible user in the queue is identified and notified to claim the slot.

This ensures fair allocation and maximum court utilization.

🚀 Tech Stack
Frontend

React 18

Tailwind CSS

Vite

Lucide React Icons

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

bcrypt for password security

💡 Project Highlights

Clean separation of business logic and pricing engine

Real-time pricing with configurable rules

Scalable REST API design

Production-deployed frontend and backend

Designed for real-world booking scenarios with waitlist handling

🏸 Built With Passion

Built with ❤️ for badminton enthusiasts and real-world scheduling challenges.

👉 Try it live:
https://badminton-court-booking-website.vercel.app/