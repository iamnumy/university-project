# Swabi Bazaar

MERN-stack clothing e-commerce platform. Phase 1 ships a public-facing store backed by MongoDB. Cart, checkout, auth, and admin panel land in later phases. Schema is vendor-aware from day one (`Product.sellerId`) so multi-vendor can be enabled later without a migration.

## Stack

- **Frontend** — React 18 + Vite, Tailwind CSS v4, React Router, Axios
- **Backend** — Node + Express, Mongoose, MongoDB Atlas
- **Hosting** (later) — Vercel (client), Render (server), MongoDB Atlas (db)

## Folder layout

```
.
├── client/          # React + Vite store
├── server/          # Express + Mongoose API
└── Reference douments/   # original FYP proposals
```

## One-time setup

### 1. MongoDB Atlas

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster (any region close to you)
3. Create a database user (Database Access → Add User)
4. Allow access from anywhere (Network Access → Add IP → `0.0.0.0/0`) for development
5. Click **Connect → Drivers → Node.js** and copy the connection string

### 2. Server env

```bash
cd server
cp .env.example .env
# open .env and paste your MongoDB URI into MONGODB_URI
```

### 3. Install + seed + run

In one terminal:

```bash
cd server
npm install
npm run seed     # inserts 12 sample products
npm run dev      # API on http://localhost:5000
```

In another terminal:

```bash
cd client
npm install
npm run dev      # store on http://localhost:5173
```

Open http://localhost:5173 — you should see the product grid.

## API endpoints (Phase 1)

| Method | Path                        | Purpose                |
|--------|-----------------------------|------------------------|
| GET    | `/api/health`               | Health check           |
| GET    | `/api/products`             | List + filter products |
| GET    | `/api/products/categories`  | List distinct categories |
| GET    | `/api/products/:slug`       | Single product         |

Query params on `/api/products`: `category`, `search`, `minPrice`, `maxPrice`, `sort` (`newest` \| `price_asc` \| `price_desc`), `limit`, `page`.

## Roadmap

| Phase | Scope |
|-------|-------|
| 1 ✅  | Project setup, Product schema, public read API, store UI |
| 2     | Auth — register/login, JWT, protected routes |
| 3     | Cart + checkout (simulated payment), order history |
| 4     | Admin panel — product CRUD, image upload (Cloudinary), order management |
| 5     | Search/filter polish, dashboard analytics, deploy |
| 6+    | Multi-vendor — seller registration, per-shop dashboards |
