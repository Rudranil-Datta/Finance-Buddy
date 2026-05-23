# Finance Buddy

**Finance Buddy** is a portfolio-quality, full-stack personal finance platform that combines everyday money management with AI-driven insights. Users track income and expenses, set budgets and savings goals, analyze spending patterns, and receive a LangChain-powered financial health assessment—all through a modern, responsive fintech dashboard.

Built as a production-style demo: the frontend is hosted on **Vercel**, the REST API on **Render**, and data persists in **MongoDB Atlas**.

---

## Problem & Purpose

Most people juggle spreadsheets, bank exports, and disconnected apps to understand their finances. Finance Buddy centralizes that workflow: record transactions (manually or via CSV), monitor cash flow, enforce budgets, and surface actionable guidance without leaving one application.

The platform is designed to showcase end-to-end full-stack engineering—secure authentication, real-time analytics, document import/export, and generative AI integrated into a cohesive product experience.

---

## Features

| Area | Capabilities |
|------|----------------|
| **Dashboard** | Income vs expense summary, recent activity, category breakdown, budget status, AI insight cards |
| **Transactions** | Create, edit, filter, search, and delete income/expense entries with categories |
| **Budgets** | Category budgets with progress tracking and warning notifications |
| **Goals** | Savings goals with milestones and contribution tracking |
| **Analytics** | Monthly trends, category spending, income vs expense charts |
| **Reports** | Summary views and **CSV export** (transactions, summaries, breakdowns) |
| **Import** | **CSV bulk import** with preview, row validation, and confirmation |
| **AI Insights** | Financial health score (1–100), summary, and recommendations via **LangChain + Google Gemini** |
| **Notifications** | Budget alerts, goal milestones, and bill reminders |
| **Auth** | Register, login, JWT sessions, protected routes |

---

## AI-Powered Workflow

1. **Capture data** — Manual entry or CSV import populates transactions and categories.
2. **Aggregate** — The backend computes dashboard metrics, category totals, and monthly summaries.
3. **Assess** — On the **AI Insights** page, users generate a financial health assessment:
   - With sufficient transaction history, **Gemini** analyzes aggregated stats (not raw exports of sensitive rows).
   - With sparse data, a **local rules-based fallback** still returns a starter score and guidance.
4. **Act** — Scores, summaries, and tips appear on the dashboard and AI history; users adjust budgets and goals accordingly.

Assessments are cached (24h) to balance cost and responsiveness. Rate limiting protects the AI endpoint.

---

## Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **React Router 7** (SPA)
- **Tailwind CSS 4**
- **Recharts** (charts)
- **Axios** (API client)
- **Lucide** (icons)

### Backend
- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **JWT** + **bcrypt** (authentication)
- **Zod** (validation)
- **LangChain** + **@langchain/google-genai** (AI pipeline)
- **Helmet**, **CORS**, **express-rate-limit**, **express-mongo-sanitize** (security)

### Infrastructure
- **Vercel** — static frontend + SPA rewrites
- **Render** — Node API service
- **MongoDB Atlas** — managed database

---

## Architecture

```
┌─────────────────┐      HTTPS (JWT)       ┌──────────────────────┐
│  React SPA      │ ◄──────────────────► │  Express REST API    │
│  (Vercel)       │   VITE_API_BASE_URL  │  (Render)            │
└─────────────────┘                      └──────────┬───────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────────┐
                                         │  MongoDB Atlas         │
                                         └──────────────────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────────┐
                                         │  Google Gemini API     │
                                         │  (financial health)    │
                                         └──────────────────────┘
```

### Frontend structure
- **Feature-based modules** under `frontend/src/features/` (dashboard, transactions, budgets, goals, analytics, reports, import, ai, notifications).
- **Shared UI** in `frontend/src/components/`.
- **API layer** in `frontend/src/api/` with a centralized Axios client and JWT interceptors.
- **Auth** via `AuthProvider` + route guards (`PrivateRoute` / `GuestRoute`).

### Backend structure
- **Layered design**: `routes` → `controllers` → `services` → `models`.
- **Middleware**: authentication, validation, rate limiting, error handling, security headers.
- **AI**: `financialHealth.chain.js` (Gemini) with `localFinancialHealth.js` fallback.

---

## Authentication Flow

1. User **registers** or **logs in** → API returns a **JWT** and user profile.
2. Frontend stores the token in `localStorage` and attaches `Authorization: Bearer <token>` on API requests.
3. **Protected routes** call `GET /api/auth/me` on load to refresh the session.
4. **401 responses** clear the session and redirect to login.
5. Passwords are hashed with **bcrypt**; tokens expire per server configuration (default **7 days**).

---

## Analytics & AI Insights

| Layer | Responsibility |
|-------|----------------|
| **Analytics API** | Dashboard totals, monthly expenses, category breakdown, income vs expense, recent transactions |
| **Reports API** | Period summaries and CSV export |
| **AI API** | List insights, latest insight, `POST /financial-health` to generate assessment |

The dashboard merges analytics payloads with AI results. Placeholder insight cards appear until a real assessment exists; after generation, live scores and tips replace them.

---

## CSV Import & Export

### Import (`/import`)
- Upload a CSV with columns: `title`, `amount`, `category`, `transaction type`, `date`, `notes`.
- Client-side preview validates rows against the user’s categories.
- Valid rows are sent to `POST /api/import/csv` and stored as transactions (`source: csv`).

### Export (`/reports`)
- Filter by date range.
- Download CSV for transactions (API), or client-built exports for summary, category, and monthly breakdowns.

---

## Project Structure

```
Finance-Buddy/
├── frontend/                 # React SPA (Vercel)
│   ├── src/
│   │   ├── features/         # Domain modules (dashboard, ai, import, …)
│   │   ├── api/              # HTTP clients
│   │   ├── app/              # Router, layouts, guards
│   │   └── components/       # Shared UI
│   └── vercel.json           # SPA rewrites
├── backend/                  # Express API (Render)
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── middleware/
│       ├── ai/               # LangChain + Gemini
│       └── scripts/seed/     # Demo data seeder
└── README.md
```

---

## Deployment Architecture

| Component | Platform | Role |
|-----------|----------|------|
| **Web app** | Vercel | Builds Vite production bundle; `vercel.json` rewrites all paths to `index.html` for React Router |
| **API** | Render | Runs `node src/server.js`; env vars for MongoDB, JWT, CORS, Gemini |
| **Database** | MongoDB Atlas | Persistent storage for users, transactions, budgets, goals, insights |

**CORS:** In production, the API only accepts requests from the configured `CLIENT_URL` (your Vercel origin).

**Environment variables** are managed in each host’s dashboard and are not committed to this repository.

---

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Web App)** | [https://finance-buddy.vercel.app](https://finance-buddy.vercel.app) |
| **Backend API** | [https://finance-buddy-wton.onrender.com](https://finance-buddy-wton.onrender.com) |
| **Health check** | [https://finance-buddy-wton.onrender.com/api/health](https://finance-buddy-wton.onrender.com/api/health) |

**Note:** Render’s free tier may sleep after inactivity. The first request after idle can take 30–60 seconds to wake the API.

---

## Demo Credentials

Demo login hints are shown on the sign-in page when a seeded account exists:

| Field | Value |
|-------|--------|
| **Email** | `demo@financebuddy.local` |
| **Password** | `Demo1234!` |

You can also **register a new account** and use the app with your own data.

---

## How to Test the Application

1. **Open the live app** (Vercel URL above).
2. **Sign in** with demo credentials or **Create account**.
3. **Dashboard** — Review summary cards, charts, and insight section.
4. **Transactions** — Add a few income/expense entries.
5. **Import** — Download the CSV template, fill sample rows, upload, preview, and confirm import.
6. **Budgets & Goals** — Create a budget and a savings goal; watch progress update.
7. **Analytics / Reports** — Explore charts; export a CSV from Reports.
8. **AI Insights** — Click to generate a financial health assessment (requires API key on server; sparse data uses fallback scoring).
9. **API smoke test (Postman)** — `GET /api/health`, then `POST /api/auth/login`, then `GET /api/auth/me` with Bearer token.

---

## Screenshots

> Add screenshots here for your portfolio (recommended: dashboard, transactions, AI insights, import preview).

| Dashboard | Transactions |
|-----------|--------------|
| ![Dashboard](./docs/screenshots/dashboard.png) | ![Transactions](./docs/screenshots/transactions.png) |

| AI Insights | CSV Import |
|-------------|------------|
| ![AI Insights](./docs/screenshots/ai-insights.png) | ![Import](./docs/screenshots/import.png) |

*Place image files under `docs/screenshots/` or update paths to match your assets.*

---

## Future Improvements

- **Bank connections** — Plaid or similar for automatic transaction sync
- **Multi-currency** — User-selectable currency with conversion on reports
- **Recurring transactions** — Full UI for recurring bills and subscriptions
- **Email notifications** — Budget and goal alerts outside the app
- **Mobile app** — React Native or PWA enhancements
- **Shared households** — Multi-user budgets and permissions
- **Advanced AI** — Spending forecasts, anomaly detection, natural-language Q&A over finances
- **Admin & observability** — Metrics, structured logging, and audit trails
- **Automated tests** — API integration tests and frontend E2E coverage

---

## Repository

[github.com/Rudranil-Datta/Finance-Buddy](https://github.com/Rudranil-Datta/Finance-Buddy)

---

## License

This project is intended for **portfolio and demonstration purposes**. Review repository terms before commercial use.
