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

### Dashboard
- KPI cards for revenue, bills, items sold and average bill value, each compared
  with the previous day.
- Interactive revenue trend chart for the last 7 or 30 days, with keyboard and
  screen-reader friendly data tables.
- Top products ranked by units sold, recent transactions, loading skeletons and
  actionable empty/error states.

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
- `GET /api/bills/analytics?days=7` returns today/yesterday summaries, current and
  previous range totals, a zero-filled daily series and top products.
- Bill listing is sorted by `createdAt` (newest first).
- Product lookup and bill creation retain their existing contracts.

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Create React App, Tailwind CSS 3, Framer Motion, React Three Fiber, Three.js, Lucide icons, html5-qrcode |
| Backend | Node.js, Express 5, Mongoose 9, MongoDB |
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
| `#/dashboard` | Sales dashboard |
| `#/pos` | Point of sale |
| `#/transactions` | Transaction history |

The landing page links into the workspace, and the sidebar includes a
**Back to site** link. Inside the workspace, `Alt + 1/2/3` switches views.

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### Backend

```bash
cd backend
npm install
npm start
```

The API listens on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The app opens on `http://localhost:3000`. To point at a different API, create
`frontend/.env.local`:

```dotenv
REACT_APP_API_URL=http://localhost:5000/api
```

### Production build

```bash
cd frontend
npm run build
```

## API reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/products/:barcode` | Look up a product by barcode |
| `POST` | `/api/products/add` | Add a product |
| `GET` | `/api/bills` | List bills, newest first |
| `POST` | `/api/bills/add` | Create a bill (server calculates the total) |
| `GET` | `/api/bills/analytics?days=7` | Dashboard analytics |

## Project structure

```
backend/
  models/          Mongoose schemas for products and bills
  routes/          Product and bill/analytics endpoints
frontend/
  src/components/  Layout, dashboard, POS, landing and shared UI components
  src/hooks/       Analytics and bill data hooks
  src/lib/         API client and formatting helpers
  src/pages/       Landing, Dashboard, Point of Sale and Transactions pages
design-system/     Persisted UI/UX Pro Max design system
```
