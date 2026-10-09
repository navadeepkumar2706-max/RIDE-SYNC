# RideSync — Campus & Commuter Carpooling

> **"Same Route. Shared Ride. Smarter Commute."**

RideSync is a verified, community-first carpooling web platform designed specifically for college students and tech commuters in Hyderabad, India. Drivers publish empty seats on their daily routes, and passengers discover compatible rides, request seats, and receive booking confirmations with concurrency-safe atomic inventory guarantees.

---

## Run & Operate

* `npm run dev` — runs both the Express API server (port 5000) and the Vite frontend (port 5173) concurrently
* `npm run server` — runs the Express API server standalone
* `npm run client` — runs Vite frontend standalone
* `npm run build` — compiles the production frontend bundle
* `npm run seed` — seeds MongoDB with Hyderabad hubs, realistic sample rides, and demo accounts
* `npm test` — runs the full automated concurrency and end-to-end journey test suite

### Required Environment Variables (.env)
* `PORT=5000`
* `MONGODB_URI=mongodb://127.0.0.1:27017/ridesync` (or MongoDB Atlas connection string)
* `JWT_SECRET=ridesync_super_secret_jwt_key_2026_hyderabad`
* `CLIENT_URL=http://localhost:5173`

---

## Stack

* **Frontend:** React 19, Vite 6, Tailwind CSS, Lucide React
* **Backend:** Node.js, Express.js 4, RESTful endpoints with centralized error handling
* **Database:** MongoDB Community / MongoDB Atlas with Mongoose 8
* **Authentication:** Secure JWT authentication stored in HttpOnly cookies
* **Routing:** React Router v7
* **Mapping:** React Leaflet 5 + OpenStreetMap with custom SVG markers and route polylines
* **Concurrency:** Atomic MongoDB `$gte` conditional updates for race-free seat reservations

---

## Where Things Live

* `server/index.js` — Main Express server entrypoint
* `server/config/db.js` — MongoDB Mongoose connection
* `server/models/` — Data models: `User.js`, `Ride.js`, `Booking.js`, `Notification.js`, `Review.js`, `Report.js`
* `server/routes/` — API routes: `/api/auth`, `/api/users`, `/api/rides`, `/api/bookings`, `/api/notifications`, `/api/reviews`, `/api/reports`, `/api/admin`
* `server/utils/smartMatch.js` — Deterministic smart matching ranking algorithm
* `server/tests/` — Automated test suites: `booking.test.js` (concurrency) and `e2e_journey.test.js` (full journey)
* `src/components/layout/` — `Navbar.jsx`, `Footer.jsx`, `AppLayout.jsx`
* `src/components/map/` — `RouteMap.jsx` (interactive Leaflet map with custom SVG pins)
* `src/components/rides/` — `RideCard.jsx`, `SeatRequestModal.jsx`
* `src/pages/` — `LandingPage.jsx`, `FindRidesPage.jsx`, `RideDetailsPage.jsx`, `OfferRidePage.jsx`, `DashboardPage.jsx`, `MyRidesPage.jsx`, `MyBookingsPage.jsx`, `ProfilePage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`, `AdminDashboardPage.jsx`

---

## Architecture Decisions

1. **Deterministic 40/35/25 Smart Ride Match:**
   Matches are deterministically ranked from 0% to 100% using weighted factors:
   * 40% Pickup proximity (Haversine great-circle distance)
   * 35% Departure time compatibility (minute difference penalty)
   * 25% Route and intermediate waypoint detour suitability

2. **Atomic Seat Allocation & Concurrency Safety:**
   To prevent overbooking when multiple passengers attempt to book the last available seat simultaneously, reservations use atomic MongoDB conditional updates:
   ```javascript
   Ride.findOneAndUpdate(
     { _id: rideId, availableSeats: { $gte: seatsRequested } },
     { $inc: { availableSeats: -seatsRequested } },
     { new: true }
   );
   ```
   Cancellations restore seats atomically exactly once via `$inc: { availableSeats: seatsRequested }`.

3. **Institutional Domain Verification:**
   Users registering with academic email domains (`.ac.in` and `.edu`) automatically receive verified campus shields across driver profiles, search cards, and booking requests.

---

## Product Capabilities

* **Landing Experience:** Hero headline *"Your Route. Their Ride. Everyone Wins."*, live route search widget, interactive Hyderabad corridors, architecture features, and 3-step how-it-works section.
* **Smart Ride Search:** Search with filters (pickup, destination, date, seats needed, detour flexibility) with dual Map + Cards view and deterministic match percentage badges.
* **Publish a Ride:** Drivers specify origin, destination, intermediate waypoints (e.g. Miyapur Metro, KPHB), departure date/time, seat capacity, fuel share cost, and vehicle details with interactive route map preview.
* **Atomic Seat Requests & Approvals:** Passengers request seats; drivers inspect passenger credentials and accept or decline requests directly from the dashboard or My Rides page.
* **Passenger Bookings & Ticket Details:** Confirmed bookings reveal driver vehicle registration and contact information for pickup coordination.
* **In-App Notification Center:** Unread badge counter with real-time alerts for booking requests, confirmations, and cancellations.
* **Driver Reviews & Safety Reports:** Passengers rate completed rides and can submit safety reports for administrator review.
* **Admin Moderation Console:** Platform metrics, user verification toggle, account suspension, and safety reports queue.

---

## Demo Accounts

* **Driver:** `arjun.sharma@iith.ac.in` (Password: `Password123!`) — IIT Hyderabad driver with published rides
* **Passenger:** `ananya.d@osmania.ac.in` (Password: `Password123!`) — Osmania University commuter
* **Admin:** `admin@ridesync.in` (Password: `Password123!`) — Platform Administrator
