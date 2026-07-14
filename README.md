# ZenPay — Self‑Checkout System

A full‑stack **self‑checkout** web application that lets customers scan product QR/barcodes, build a cart, and complete checkout — with an integrated **Admin panel** for managing products, orders, and fraud detection powered by a machine learning risk engine.

---

## Overview

Retail checkout queues are slow and require staff at every counter. **ZenPay** provides a modern self‑checkout flow where customers scan items on their own device while the backend records the session for auditing and admin review.

---

## How It Works

### Customer Flow
1. Open the checkout terminal (`/`).
2. Scan items using the device camera (barcode/QR) or browse the product catalog.
3. Items are added to the basket with running totals.
4. Complete payment and receive a **verification QR code**.
5. The QR code is validated at the exit gate (`GET /verify/:token`).

### Admin Flow
1. Sign in at `/admin/login` (JWT‑based authentication).
2. Manage products, review orders, investigate flagged transactions.
3. Monitor the ML‑powered **Risk Engine** for fraud detection insights.
4. Configure system parameters (risk thresholds, weight tolerances).

### Verification Flow
- `GET /verify/:token` validates checkout QR codes.
- Rejects tokens that are expired, already verified, or not found.
- Weight verification cross-checks expected vs. actual item weights.

---

## Tech Stack

### Frontend (`/frontend`)
- **React 18** + **React Router v6**
- **Vite** (dev server & build)
- **Tailwind CSS** (dark theme)
- **html5-qrcode** (barcode scanning) + **qrcode.react** (QR generation)

### Backend (`/backend`)
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** + **bcryptjs** (authentication)
- **uuid** (session & token generation)

### ML Risk Engine (`/ml`)
- **Python** + **FastAPI**
- **scikit-learn** (RandomForest classifier)
- Rule-based fallback when ML service is unavailable

---

## Project Structure

```
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js          # Express entry point
│       ├── db.js              # MongoDB connection
│       ├── config/            # Environment configuration
│       ├── controllers/       # Route handlers
│       ├── middleware/        # Auth & error handling
│       ├── models/            # Mongoose schemas
│       ├── routes/            # API route definitions
│       ├── scripts/           # Seed script
│       └── services/          # Business logic
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.jsx           # React entry point
│       ├── App.jsx            # Routing
│       ├── api.js             # API client
│       ├── components/        # Reusable UI components
│       └── pages/             # Page components
├── ml/
│   ├── api.py                 # FastAPI prediction service
│   ├── train_model.py         # Model training
│   ├── generate_dataset.py    # Synthetic data generation
│   └── requirements.txt
├── render.yaml                # Render deployment config
└── README.md
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/network-url` | Server network URL |
| GET | `/api/product/:barcode` | Product lookup by barcode |
| POST | `/api/basket/log` | Log basket action for audit |
| POST | `/api/session/start` | Start checkout session |
| POST | `/api/orders` | Create order from basket |
| POST | `/api/verify-weight` | Weight verification |
| GET | `/verify/:token` | QR token verification |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login (returns JWT) |
| GET | `/api/auth/me` | Current user info |

### Admin (requires auth + role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | `/api/products[/:id]` | Product CRUD |
| GET | `/api/admin/orders` | List orders |
| GET | `/api/admin/orders/:id` | Order details |
| GET | `/api/admin/mismatches` | Weight mismatches |
| GET | `/api/admin/flagged` | Flagged orders |
| GET | `/api/admin/random-check` | Random check candidates |
| POST | `/api/admin/orders/:id/manual-check` | Mark manual check |
| GET/PUT | `/api/admin/config` | System configuration |
| GET | `/api/admin/audit` | Audit logs |

---

## Getting Started

### Prerequisites
- **Node.js** (LTS recommended)
- **MongoDB** (local or Atlas)
- **Python 3.8+** (for ML service, optional)

### 1. Backend

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/zenpay
JWT_SECRET=your-secret-key-here
EOF

# Seed sample data
npm run seed

# Start development server
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:3000` with API proxy to the backend.

### 3. ML Service (Optional)

```bash
cd ml
pip install -r requirements.txt
uvicorn api:app --host 0.0.0.0 --port 8000
```

The backend falls back to rule-based risk scoring when the ML service is unavailable.

---

## Deployment

A `render.yaml` is included for one-click deployment on [Render](https://render.com). Set the following environment variables in your dashboard:

- `MONGODB_URI` — Your MongoDB Atlas connection string
- `JWT_SECRET` — A secure random key
- `ML_SERVICE_URL` — URL of the deployed ML service

---

## License

MIT
