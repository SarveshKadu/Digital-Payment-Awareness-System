# PayShield — Digital Payment Awareness & Safety System

**Tagline:** "Think Before You Pay."

PayShield is a full-stack educational web platform (built as a college CEP project) that
teaches people how to use digital payments safely and how to recognize online payment fraud.
It is **not** a real payment system: it never processes real transactions and never
collects real banking credentials, OTPs, PINs, or CVVs.

---

## ✨ Key Features

- **Can You Spot the Scam?** — 10 realistic fictional fraud scenarios with SAFE/SUSPICIOUS decisions, explanations and points.
- **Digital Payment Simulator** — a fictional, step-by-step UPI-style payment walkthrough with safety checkpoints. No real money ever moves.
- **Fraud Radar** — an interactive, fictional risk-score calculator based on situational red flags.
- **Payment Safety Map** — a clickable Sender → Payment App → Bank → Receiver journey.
- **Before You Pay Checklist** — a quick interactive pre-payment checklist.
- **Learn Digital Payments** — explainer cards for UPI, QR codes, debit/credit cards, wallets, internet banking, contactless payments.
- **Myths vs Facts** — 12 common digital-payment misconceptions, corrected.
- **Quiz Arena** — a 15-question timed gamified quiz with a safety-level result (Beginner → PayShield Expert).
- **User Dashboard** — quiz scores, scams identified, safety level, learning progress bars, badges, digital safety score.
- **Achievements/Badges** — First Defender, Scam Spotter, Payment Pro, Fraud Fighter, PayShield Expert.
- **Admin Dashboard** — manage users, quiz attempts, fraud scenarios, learning content, feedback, and view charts.
- **Feedback & Awareness Survey** — 1–5 confidence rating + free text, stored in MongoDB.
- **Emergency Help** — a clear "I Think I've Been Scammed" action page.
- **Multilingual** — English / Marathi toggle.
- **Digital Safety Score** — a personalized homepage mini-quiz that scores strengths/gaps and recommends modules.
- **Dark/Light mode**, glassmorphism UI, responsive on mobile/tablet/desktop.

---

## 🗂 Project Structure

```
payshield/
├── frontend/
│   ├── pages/            # All HTML pages
│   ├── components/       # Shared navbar/footer JS component renderer
│   ├── css/               # style.css (design system), dashboard.css, admin.css
│   ├── js/                # api.js, i18n.js, main.js, auth.js, and one file per feature
│   └── assets/
├── backend/
│   ├── controllers/       # Route handler logic
│   ├── models/            # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── middleware/        # auth, role, error handling
│   ├── config/db.js        # MongoDB connection
│   ├── seed/seedData.js    # Seeds quiz questions, scenarios, learning content, admin user
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set at minimum:

```
MONGO_URI=mongodb://127.0.0.1:27017/payshield
JWT_SECRET=some_long_random_string
```

Seed the database with quiz questions, fraud scenarios, learning content and a default admin account:

```bash
npm run seed
```

This creates an admin login:
- **Email:** `admin@payshield.local`
- **Password:** `Admin@123`

Start the API server:

```bash
npm run dev      # with nodemon, auto-restarts on changes
# or
npm start
```

The API will run on `http://localhost:5000` by default, and also serves the `frontend/`
folder as static files for local convenience (so visiting `http://localhost:5000` opens
the landing page directly).

### 3. Frontend setup

No build step is required — it's plain HTML/CSS/JS. Two options:

**Option A — via the backend's static server (simplest):**
Just open `http://localhost:5000` once the backend is running (see above). The API
calls in `frontend/js/api.js` default to the relative path `/api`, which works out of
the box in this mode.

**Option B — serve frontend separately (e.g. Live Server, `npx serve`):**
1. Serve the `frontend/` folder with any static file server.
2. Because the frontend is now on a different origin from the API, set the API base
   explicitly by adding a `data-api-base` attribute to `<body>` in every HTML page, e.g.:
   ```html
   <body data-api-base="http://localhost:5000/api">
   ```
3. Make sure `CLIENT_URL` in `backend/.env` matches the frontend's origin for CORS.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| GET | `/api/auth/profile` | User | Get logged-in profile |

### Quiz
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/quiz/questions` | User | Get quiz questions (answers hidden) |
| POST | `/api/quiz/submit` | User | Submit answers, get score + badges |
| GET | `/api/quiz/results` | User | Get your past results |

### Fraud Scenarios
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/scenarios` | Public | List scenarios (answer hidden) |
| POST | `/api/scenarios/:id/answer` | User (optional) | Submit SAFE/SUSPICIOUS decision |
| POST | `/api/scenarios` | Admin | Create scenario |
| PUT | `/api/scenarios/:id` | Admin | Update scenario |
| DELETE | `/api/scenarios/:id` | Admin | Delete scenario |

### Payment / Learning Content
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/payment-methods` | Public | List learning content |
| POST | `/api/payment-methods` | Admin | Create content |
| PUT | `/api/payment-methods/:id` | Admin | Update content |
| DELETE | `/api/payment-methods/:id` | Admin | Delete content |

### Feedback
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/feedback` | Public/User | Submit survey response |
| GET | `/api/feedback` | Admin | List all feedback + average rating |

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard` | User | Get dashboard data |
| POST | `/api/dashboard/safety-score` | User | Save Digital Safety Score result |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/statistics` | Admin | Aggregate stats + chart data |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/quiz-attempts` | Admin | List all quiz attempts |

---

## 🗄 MongoDB Collections

- **Users** — name, email, password (hashed), role, safetyLevel, points, scamsIdentified, digitalSafetyScore, learningProgress
- **QuizQuestions** — question, options, correctAnswer, explanation, category
- **QuizResults** — userId, score, percentage, safetyLevel, answers, completedAt
- **FraudScenarios** — title, message, correctDecision, explanation, warningSigns, category, points
- **LearningContent** — title, category, description, howItWorks, advantages, risks, safetyTips
- **Feedback** — userId, name, email, confidenceRating, message
- **Achievements** — userId, badge, unlockedAt

---

## 🔐 Security Notes

- Passwords hashed with **bcrypt**.
- Authentication via **JWT** (`Authorization: Bearer <token>`).
- Role-based authorization (`user` / `admin`) protects admin routes.
- `helmet`, `cors`, and JSON body-size limits are enabled in `server.js`.
- The app **never** stores UPI PINs, OTPs, card PINs, CVVs, bank passwords, or any real
  payment credentials — this is enforced by design: no such fields exist anywhere in the
  data models or forms.
- All financial simulations (Payment Simulator, Fraud Radar, Digital Safety Score) are
  clearly labeled as fictional/educational and run entirely client-side or against
  fictional data.

---

## 🌐 Multilingual Support

English and Marathi strings live in `frontend/js/i18n.js`. Elements tagged with
`data-i18n="key"` are automatically updated when the language selector in the navbar
is changed. Add more keys/translations there to extend coverage.

---

## 🧑‍💻 Tech Stack

- **Frontend:** HTML5, CSS3 (custom design system, no framework), vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Security:** helmet, cors, express input validation in controllers

---

## ⚠️ Disclaimer

PayShield is an educational simulator built for a college project. It does not process
real payments, does not connect to any real bank or UPI network, and must never be used
to collect genuine financial credentials. Risk scores and safety scores shown throughout
the app are fictional and for learning purposes only.
