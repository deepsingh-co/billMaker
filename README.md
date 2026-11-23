# Barcode Suite

A retail point-of-sale and barcode billing workspace with a live sales
dashboard. Scan a product, build a cart, generate an invoice, and review store
performance from a single interface.

## Features

### Landing page
- Marketing site at the root route with an interactive WebGL hero built with
  React Three Fiber: a floating barcode invoice, animated scanning beam,
  particle field and pointer-driven parallax.
- The 3D scene loads on demand when it enters the viewport, is capped at 1.5x
  pixel ratio and falls back to an animated static invoice for reduced motion,
  Save-Data visitors or software-only WebGL renderers.
- Feature grid, scan -> bill -> analyse workflow, a CSS 3D dashboard preview
  that tilts toward the cursor, closing CTA and footer.
- Scroll-triggered reveals and a reading-progress bar that respect reduced
  motion preferences.
- Sign-in and create-account actions in the header and footer, with the
  workspace CTA adapting to the current session.

### Authentication
- Dedicated sign-in and sign-up screens at `#/login` and `#/signup`, with
  inline validation, password visibility toggles, a password checklist and
  accessible error messaging.
- Passwords are hashed with bcrypt (12 rounds). Sessions use signed JWTs with a
  1-day default or a 30-day "keep me signed in" expiry.
- Guests who open a workspace URL are sent to sign in and returned to the
  requested view after authentication. Protected API requests attach the bearer
  token automatically and end the session on a 401.
- Sign-in and registration are rate-limited, and saved sessions are restored on
  reload. The workspace header includes a profile menu with sign-out.

### Dashboard
- KPI cards for revenue, bills, items sold and average bill value, each compared
  with the previous day.
- Interactive revenue trend chart for the last 7 or 30 days, with keyboard and
  screen-reader friendly data tables.
- Top products ranked by units sold, recent transactions, loading skeletons and
  actionable empty/error states.
- Light and dark appearance toggle in the workspace header. The choice persists
  per browser and applies across the dashboard, point of sale and transactions;
  first-time visitors follow their system preference.

### Point of sale
- Camera barcode scanning via `html5-qrcode`, with a manual barcode entry
  fallback when no camera is available.
- Cart quantity controls, line totals, remove/clear actions and toast feedback.
- Server-validated invoice generation: totals are recalculated from line items
  before the bill is stored.

### Transactions
- Search by invoice number, product name or barcode.
- Date filters for today, last 7 days, last 30 days or all time.
- Expandable rows with full line-item breakdowns on desktop and mobile.
- Summary metrics for the filtered result set.

### API
- `POST /api/auth/register` and `POST /api/auth/login` return a JWT and the
  public user profile. `GET /api/auth/me` restores a saved session.
- `GET /api/bills/analytics?days=7` returns today/yesterday summaries, current and
  previous range totals, a zero-filled daily series and top products.
- Bill listing is sorted by `createdAt` (newest first).
- Product lookup and bill creation retain their existing contracts, now behind
  JWT authentication.

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Create React App, Tailwind CSS 3, Framer Motion, React Three Fiber, Three.js, Lucide icons, html5-qrcode |
| Backend | Node.js, Express 5, Mongoose 9, MongoDB, JWT, bcryptjs, express-rate-limit |
| Design | UI/UX Pro Max skill (data-dense dashboard + scroll-storytelling landing) |

The generated design system lives in
[`design-system/barcode-suite/MASTER.md`](design-system/barcode-suite/MASTER.md)
with page overrides in `design-system/barcode-suite/pages/dashboard.md` and
`design-system/barcode-suite/pages/landing.md`.

## Routes

Hash routing keeps the marketing site and the workspace in one static build.

| Route | View |
| --- | --- |
| `#/` or `#/home` | Marketing landing page |
| `#/login` | Sign in |
| `#/signup` | Create an account |
| `#/dashboard` | Sales dashboard (signed in) |
| `#/pos` | Point of sale (signed in) |
| `#/transactions` | Transaction history (signed in) |

The landing page links into the workspace, and the sidebar includes a
**Back to site** link. Guests opening a workspace route are redirected to
`#/login?next=<route>` and returned there after signing in. Inside the
workspace, `Alt + 1/2/3` switches views.

## Getting started

### Prerequisites
- Node.js 20.19+ (required by Mongoose 9)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Set a long random `JWT_SECRET` in `backend/.env` before starting the API. Generate
one with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`MONGODB_URI` defaults to `mongodb://127.0.0.1:27017/barcodeDB`. The API listens
on `http://localhost:5000`; `.env` is ignored by git and must never be committed.

### Frontend

```bash
cd frontend
npm install
npm start
```

The app opens on `http://localhost:3000`. Create the first account at
`#/signup`, then use it to sign in and open the workspace. To point at a
different API, create `frontend/.env.local`:

```dotenv
REACT_APP_API_URL=http://localhost:5000/api
```

### Production build

```bash
cd frontend
npm run build
```

## API reference

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create an account and return a JWT |
| `POST` | `/api/auth/login` | Public | Sign in and return a JWT |
| `GET` | `/api/auth/me` | Bearer | Return the signed-in user |
| `GET` | `/api/products/:barcode` | Bearer | Look up a product by barcode |
| `POST` | `/api/products/add` | Bearer | Add a product |
| `GET` | `/api/bills` | Bearer | List bills, newest first |
| `POST` | `/api/bills/add` | Bearer | Create a bill (server calculates the total) |
| `GET` | `/api/bills/analytics?days=7` | Bearer | Dashboard analytics |

Authenticated requests use `Authorization: Bearer <token>`. The frontend adds
the header automatically. Registration accepts `name`, `email` and `password`;
login accepts `email`, `password` and an optional `remember` boolean.

## Project structure

```
backend/
  lib/             JWT helpers and shared auth validation
  middleware/      JWT route guard
  models/          Mongoose schemas for products, bills and users
  routes/          Auth, product and bill/analytics endpoints
frontend/
  src/components/auth/  Auth provider, split layout and form fields
  src/components/  Layout, dashboard, POS, landing and shared UI components
  src/hooks/       Analytics and bill data hooks
  src/lib/         API client, token storage, auth validation and formatting
  src/pages/       Landing, Login, Signup, Dashboard, POS and Transactions
design-system/     Persisted UI/UX Pro Max design system
```

## Tests

```bash
cd backend && npm test
cd frontend && npm test -- --watchAll=false
```

The backend suite covers password/email validation and JWT signing. The frontend
suite covers the shared auth form validation and account initials helpers.
