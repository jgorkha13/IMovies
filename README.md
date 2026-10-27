# 🍿 IMovies - Movie Ticket Booking Made Simple

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** movie ticket booking web application designed to deliver a cinema ticketing experience with real-time seat availability tracking, JWT user authentication, digital ticket generation, and a cinema administration portal.

Built to fulfill all requirements of the **Skillwallet Full Stack MERN Development Program**.

---

## 🌟 Key Features

### 🎬 For Moviegoers (Users)
- **Interactive Movie Showcase**: Browse now-showing and upcoming movies with high-resolution posters, trailers, certificates (`UA`, `PG-13`, `R`), duration, and genre tags.
- **Smart Filtering & Live Search**: Instant search by movie title, genre category pills (*Action, Sci-Fi, Drama, Adventure, etc.*), and language.
- **Showtime Selection**: View movie schedules across multiple partner theaters (*IMAX, Dolby Atmos, 4DX*) and upcoming calendar dates.
- **Interactive Visual Cinema Seat Map**:
  - Real-time seat tracking (available, selected, and sold out).
  - Tiered seating: **Standard Section** & **VIP Prime Recliners**.
  - Aisle separation with curved glowing cinema screen visualization.
  - Multi-seat reservation (up to 8 seats) with dynamic price calculation.
- **Checkout & Simulated Payment Gateway**:
  - Transparent price breakdown (tickets subtotal + convenience fees + taxes).
  - Multiple payment methods: Credit/Debit Card, UPI QR Code, Net Banking, and **Instant 1-Click Demo Pay**.
  - Celebratory confetti on confirmation.
- **Digital Movie Pass (E-Ticket)**:
  - Ticket stub design with Booking ID (`IMOV-XXXXXX`), screen/audi details, seat tags, and scannable QR/barcode.
  - Built-in **Print / Download Pass** capability (`window.print()`).
- **User Booking Dashboard**:
  - View all past and active ticket reservations.
  - One-click ticket cancellation with instant seat release back into theater inventory.

### 🛡️ For Cinema Managers (Admin Console)
- **Executive Analytics Overview**: Live metrics for Total Revenue ($), Total Tickets Sold, Active Movies, and Registered Users.
- **Movie Catalog Management**: Add new movies with synopsis, director, cast, trailer URL, and poster assets, or remove inactive titles.
- **Showtime Scheduler**: Assign movies to theaters, screens, dates, time slots, and set customized standard/VIP ticket pricing.
- **Platform Reservations Feed**: Audit all customer bookings, payment statuses, and seat allocations.
- **1-Click Database Reset & Seed**: Reset and re-populate the cinema database with fresh blockbuster movies and sample bookings at any time.

### ⚡ 1-Click Demo Logins
Pre-configured demo credentials ready to test:
- **Admin Account**: `admin@imovies.com` / `admin123`
- **User Account**: `user@imovies.com` / `user123`

---

## 🛠️ Technology Stack & Architecture

| Layer | Technologies Used |
|---|---|
| **Frontend UI** | React.js (v18), Vite, Bootstrap 5.3, Bootstrap Icons, Canvas-Confetti |
| **Routing & State** | React Router v6, React Context API (`AuthContext`), Axios |
| **Backend API** | Node.js, Express.js (RESTful architecture) |
| **Database & ODM** | MongoDB, Mongoose ODM |
| **Security & Auth** | JSON Web Tokens (JWT), BCrypt.js password hashing |
| **Deployment** | Docker, Railway (`railway.json`), Fly.io (`fly.toml`), Procfile |

---

## 📂 Project Directory Structure

```text
IMovies/
├── client/                     # React Frontend (Vite + Bootstrap 5)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, MovieCard, SeatMatrix, TicketModal, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT management & session persistence)
│   │   ├── pages/              # Home, MovieDetails, SeatBooking, Checkout, Success, MyBookings, Login, Admin
│   │   ├── services/           # Axios API service instance
│   │   ├── App.jsx             # Client-side routing configuration
│   │   ├── index.css           # Cinema dark theme & custom styling
│   │   └── main.jsx            # React root with Bootstrap bundle
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express API
│   ├── config/                 # MongoDB database connection (with auto in-memory fallback)
│   ├── controllers/            # Auth, Movies, Theaters, Shows, Bookings, Admin controllers
│   ├── middleware/             # JWT auth verification & Admin role guards
│   ├── models/                 # Mongoose schemas (User, Movie, Theater, Show, Booking)
│   ├── routes/                 # Express API route endpoints
│   ├── seed/                   # Seed data generator with blockbusters & showtimes
│   ├── package.json
│   └── server.js               # Entry point (serves API + static client build in production)
│
├── Dockerfile                  # Multi-stage container build for production
├── Procfile                    # Web process runner
├── railway.json                # Railway.app configuration
├── fly.toml                    # Fly.io deployment manifest
├── package.json                # Monorepo orchestration scripts
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher)
- [npm](https://www.npmjs.com/) (v8.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local service or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/IMovies.git
cd IMovies

# Install root, server, and client dependencies in one command:
npm run install-all
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

Open `.env` and configure your settings:
```ini
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2026
```
*(If connecting to MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string).*

### 3. Seed Sample Database
Populate high-resolution blockbuster movies, partner theaters, and scheduled showtimes:
```bash
npm run seed
```

### 4. Start the Application

You have two simple options:

**Option 1: Unified Full-Stack Server (Recommended & Simplest)**
```bash
npm start
```
* **Full Application (Frontend + Backend)**: [http://localhost:5050](http://localhost:5050)

**Option 2: Development Mode (Hot-Reloading)**
```bash
npm run dev
```
* **Frontend Dev Server**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:5050/api/health](http://localhost:5050/api/health)

---

## 🌐 Deployment Guide (Railway & Fly.io)

### Option A: Deploy to Railway (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit of IMovies full stack application"
   git branch -M main
   git remote add origin https://github.com/<your-github-username>/IMovies.git
   git push -u origin main
   ```

2. **Deploy on [Railway.app](https://railway.app)**:
   - Log in to Railway and click **"New Project"**.
   - Select **"Deploy from GitHub repo"** and choose your `IMovies` repository.
   - Click **"Add a Service"** -> **"Database"** -> **"MongoDB"** (or use your free MongoDB Atlas URI).
   - In your Web Service settings, go to the **Variables** tab and add:
     - `MONGODB_URI`: `<Your MongoDB Connection URL>`
     - `JWT_SECRET`: `your_secure_random_jwt_secret_key`
     - `NODE_ENV`: `production`
     - `PORT`: `5000`
   - In the **Settings** tab under *Networking*, click **"Generate Domain"** to get your public live URL (e.g., `https://imovies-production.up.railway.app`).

Railway will automatically detect the root `Dockerfile` and build both the frontend and backend into a single high-performance container!

---

### Option B: Deploy to Fly.io

1. Install Fly CLI: `brew install flyctl` (or `curl -L https://fly.io/install.sh | sh`).
2. Log in: `fly auth login`.
3. Launch app:
   ```bash
   fly launch --no-deploy
   ```
4. Set production secrets:
   ```bash
   fly secrets set MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/imovies?retryWrites=true&w=majority" JWT_SECRET="your_secure_jwt_secret"
   ```
5. Deploy:
   ```bash
   fly deploy
   ```

---

## 📡 RESTful API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Bearer Token |
| `GET` | `/api/movies` | List movies (supports `?search=&genre=&language=`) | Public |
| `GET` | `/api/movies/:id` | Get movie details | Public |
| `POST` | `/api/movies` | Create a new movie | Admin Only |
| `DELETE` | `/api/movies/:id` | Remove movie and related shows | Admin Only |
| `GET` | `/api/theaters` | List all cinema locations | Public |
| `GET` | `/api/shows` | Query shows (supports `?movie=&date=&theater=`) | Public |
| `GET` | `/api/shows/:id` | Get show details & booked seat map | Public |
| `POST` | `/api/shows` | Schedule a new showtime | Admin Only |
| `DELETE` | `/api/shows/:id` | Delete a scheduled showtime | Admin Only |
| `POST` | `/api/bookings` | Reserve seats and confirm booking | Bearer Token |
| `GET` | `/api/bookings/my` | Retrieve logged-in user's bookings | Bearer Token |
| `GET` | `/api/bookings/:id` | Get specific booking pass details | Bearer Token |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking & release seats | Bearer Token |
| `GET` | `/api/admin/stats` | Retrieve platform revenue & metrics | Admin Only |
| `GET` | `/api/admin/bookings` | View all platform customer bookings | Admin Only |
| `POST` | `/api/seed` | Reset & re-seed cinema database | Public / Demo |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
