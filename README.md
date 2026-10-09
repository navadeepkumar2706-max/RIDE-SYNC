# 🚗 RideSync

> **"Same Route. Shared Ride. Smarter Commute."**

**RideSync** is a full-stack, verified, campus-focused carpooling web platform designed for university students, faculty, and tech commuters in Hyderabad, India. It bridges university campuses (**IIT Hyderabad, BITS Pilani Hyderabad, IIIT Hyderabad, Osmania University**) with tech employment corridors (**HITEC City, Cyber Towers, Financial District / Nanakramguda**).

Drivers with empty car seats publish their daily routes, and passengers search for compatible commutes, receive deterministic smart match scores, and request seats with concurrency-safe atomic booking guarantees.

---

## 🛠️ Technology Stack

* **Frontend:** React 19 + Vite 6
* **Styling:** Tailwind CSS (Light-gray / white backgrounds, navy text, emerald `#059669` brand accents)
* **Backend:** Node.js + Express.js 4 (REST API on port 5000 with centralized error handling & input validation)
* **Database:** MongoDB (Local or MongoDB Atlas) + Mongoose 8
* **Authentication:** JWT stored in secure HttpOnly cookies + role-based access control (`user`, `admin`)
* **Routing:** React Router v7
* **Maps:** React Leaflet 5 + OpenStreetMap tile layers with custom SVG marker pins and dynamic route polylines
* **Icons:** Lucide React
* **Testing:** Concurrency and end-to-end integration test suite (`npm test`)

---

## 🌟 Key Features & Architecture

### 1. Deterministic Smart Ride Matching (0–100% Score)
Matching rides are scored and ranked deterministically using a weighted algorithm:
* **Pickup Proximity (40%):** Great-circle distance calculation via the Haversine formula from rider pickup to driver origin.
* **Departure-Time Compatibility (35%):** Absolute minute-difference penalty within user flexibility windows.
* **Route & Detour Suitability (25%):** Waypoint proximity and destination alignment.

### 2. Concurrency-Safe Atomic Seat Allocation
Prevents race conditions and double-booking when multiple passengers request the last available seat simultaneously:
```javascript
// Atomic conditional update ensures no overbooking
const updatedRide = await Ride.findOneAndUpdate(
  {
    _id: rideId,
    availableSeats: { $gte: seatsRequested }, // Condition: seat capacity available
  },
  {
    $inc: { availableSeats: -seatsRequested }, // Decrement seats atomically
  },
  { new: true }
);
```
Cancellations restore seats exactly once using `$inc: { availableSeats: seatsRequested }`.

### 3. Institutional Campus Verification
* Automatically recognizes institutional email domains (e.g. `@iith.ac.in`, `@hyderabad.bits-pilani.ac.in`, `@iiit.ac.in`, `@osmania.ac.in`).
* Displays verified campus shields and institution badges across driver profiles and search results.

### 4. Interactive Route Geometry on Maps
* Powered by **React Leaflet** and **OpenStreetMap**.
* Plots origin (A), intermediate waypoints (•), and destination (B) with responsive polyline routing and automatic bounds fitting.

### 5. In-App Notification Center
* Notification bell with unread badge counter and auto-refresh.
* In-app alerts for incoming requests, approvals, rejections, and cancellations.

### 6. Admin Telemetry & Moderation Console
* Protected `/admin` route with backend permission validation.
* Live platform metrics (total users, active rides, confirmed bookings, safety reports).
* User moderation (approve/revoke institutional verification, suspend/unsuspend accounts).
* Demo database reset/re-seed button for easy testing.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18 or higher (tested on Node v22)
* **MongoDB**: Local MongoDB community service (`mongodb://127.0.0.1:27017/ridesync`) or MongoDB Atlas URI

### Installation
```bash
# 1. Clone or navigate to the project directory
cd APP

# 2. Install dependencies (backend & frontend)
npm install

# 3. Configure environment variables (a pre-configured .env is included)
# .env file:
# PORT=5000
# MONGODB_URI=mongodb://127.0.0.1:27017/ridesync
# JWT_SECRET=ridesync_super_secret_jwt_key_2026_hyderabad
# CLIENT_URL=http://localhost:5173
```

### Seeding Demo Data
To populate the database with realistic Hyderabad corridors and test accounts:
```bash
npm run seed
```

### Starting the Application
```bash
npm run dev
```
* **Frontend:** `http://localhost:5173`
* **Backend API:** `http://localhost:5000/api`

---

## 🔑 Demo & Hackathon Test Accounts

You can log in instantly using the **1-Click Demo Login** buttons on the `/login` page:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Driver** | `arjun.sharma@iith.ac.in` | `Password123!` | IIT Hyderabad student with published rides & vehicle registered |
| **Passenger** | `ananya.d@osmania.ac.in` | `Password123!` | Osmania University commuter looking for daily shared rides |
| **Admin** | `admin@ridesync.in` | `Password123!` | Platform Admin with access to `/admin` telemetry & moderation |

---

## 🧪 Automated Testing

Run the automated test suite covering both concurrency race condition handling and the full end-to-end journey:
```bash
npm test
```

### Verified Test Cases:
1. **Concurrency test:** 3 simultaneous passenger requests for a ride with only 2 seats.
2. **Overbooking rejection:** Verification that the 3rd passenger is rejected when seats are exhausted.
3. **Seat restoration:** Atomic increment when a booking is cancelled.
4. **End-to-End Journey test:** Driver publishes ride → Smart match computes score (95%) → Passenger requests seats → Driver accepts → Availability decrements atomically → Overbooking attempt blocked → Cancellation restores seats.

---

## 📁 Project Structure

```
├── server/
│   ├── config/db.js              # MongoDB Mongoose connection
│   ├── middlewares/
│   │   ├── auth.js               # JWT cookie extraction & validation
│   │   └── admin.js              # Admin role guard
│   ├── models/
│   │   ├── User.js               # User & vehicle profile schema
│   │   ├── Ride.js               # Ride schema with GeoJSON coordinates
│   │   ├── Booking.js            # Booking schema with status states
│   │   ├── Notification.js       # In-app notifications
│   │   ├── Review.js             # Ratings and reviews
│   │   └── Report.js             # User & ride safety reports
│   ├── routes/
│   │   ├── auth.js               # Register, login, logout, me
│   │   ├── users.js              # Profile & vehicle updates
│   │   ├── rides.js              # Ride publishing & smart-match search
│   │   ├── bookings.js           # Atomic seat requests & cancellations
│   │   ├── notifications.js      # In-app alerts & read states
│   │   ├── reviews.js            # Commuter ratings
│   │   ├── reports.js            # Safety report submission
│   │   └── admin.js              # Platform stats & moderation
│   ├── utils/
│   │   └── smartMatch.js         # Deterministic matching algorithm (40/35/25)
│   ├── seed.js                   # Hyderabad hubs & users seeder
│   ├── tests/
│   │   ├── booking.test.js       # Concurrency test suite
│   │   └── e2e_journey.test.js   # Complete driver-to-passenger journey test
│   └── index.js                  # Main Express server entrypoint
│
├── src/
│   ├── components/
│   │   ├── common/               # ProtectedRoute & AdminRoute guards
│   │   ├── layout/               # Navbar, AppLayout, Footer
│   │   ├── map/                  # RouteMap (React Leaflet + OSM)
│   │   └── rides/                # RideCard, SeatRequestModal
│   ├── context/
│   │   ├── AuthContext.jsx       # Global user session & auth state
│   │   └── NotificationContext.jsx # In-app notification polling & state
│   ├── lib/api.js                # Frontend REST API client
│   ├── pages/
│   │   ├── LandingPage.jsx       # Hero, route search, features, hubs, CTA
│   │   ├── FindRidesPage.jsx     # Live filters, match scores, map preview
│   │   ├── RideDetailsPage.jsx   # Route details, driver info, seat reservation
│   │   ├── OfferRidePage.jsx     # Driver ride publishing form
│   │   ├── MyRidesPage.jsx       # Driver published rides & request approvals
│   │   ├── MyBookingsPage.jsx    # Passenger bookings & contact reveal
│   │   ├── ProfilePage.jsx       # User profile, vehicle & emergency contact
│   │   ├── LoginPage.jsx         # 1-Click demo logins & authentication
│   │   ├── RegisterPage.jsx      # Sign-up with campus domain validation
│   │   └── AdminDashboardPage.jsx# Stats telemetry & user moderation
│   ├── App.jsx                   # React Router definition
│   └── main.jsx                  # React DOM mount point
├── package.json
└── vite.config.js
```

---

## 🛡️ Trust, Privacy & Safety Notes

* **Non-Commercial:** RideSync is designed strictly for sharing vehicle operating costs (fuel and tolls) among campus commuters. It is not a commercial taxi or ridesharing aggregator.
* **Privacy:** Passenger and driver contact details (phone number) are only revealed once a booking request is approved by the driver.
* **Transparency:** RideSync does not simulate fake live GPS tracking or fake SOS sirens; genuine safety is promoted via institutional email verification, mutual commuter reviews, and transparent reporting.
