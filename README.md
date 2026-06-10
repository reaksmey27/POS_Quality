# POS Quality — Full Stack POS System

**Stack:** Node.js + Express + TypeORM (JS) + MySQL | Vue 3 + Vite + Pinia | JWT Auth | MVC

---

## 📁 Project Structure

```
pos-system/
├── backend/
│   ├── src/
│   │   ├── config/         → data-source.js (TypeORM)
│   │   ├── controllers/    → request handlers only
│   │   ├── services/       → all business logic
│   │   ├── entities/       → TypeORM EntitySchema (JS)
│   │   ├── routes/         → Express routers
│   │   ├── middlewares/    → JWT auth + role guards
│   │   └── server.js       → entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── views/          → LoginView, DashboardView, PosView, ProductsView, CategoriesView, OrdersView
│   │   ├── layouts/        → AppLayout (sidebar)
│   │   ├── services/       → api.js (Axios + interceptors)
│   │   ├── stores/         → auth.store.js (Pinia)
│   │   ├── router/         → index.js (Vue Router + guards)
│   │   └── main.js
│   └── package.json
└── database/
    └── setup.sql
```

---

## 🚀 Setup Instructions

### 1. MySQL Database

```sql
CREATE DATABASE pos_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials and JWT secret

npm install
npm run dev
```

The server starts at **http://localhost:3000**  
TypeORM will auto-create all tables on first run (`synchronize: true`).

### 3. Create First Admin User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@pos.com","password":"admin123","role":0}'
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 🔐 Role System

| Role | Value | Access |
|------|-------|--------|
| Admin | 0 | Full access: CRUD all, delete, manage users |
| Manager | 1 | Create/edit products & categories, view orders |
| Cashier | 2 | POS checkout only |

---

## 📡 API Reference

### Auth
```
POST /api/auth/register    → { name, email, password, role }
POST /api/auth/login       → { email, password }
```

### Products (requires auth)
```
GET    /api/products         → all (any role)
POST   /api/products         → create (admin, manager)
PUT    /api/products/:id     → update (admin, manager)
DELETE /api/products/:id     → delete (admin only)
```

### Categories (requires auth)
```
GET    /api/categories       → all (any role)
POST   /api/categories       → create (admin, manager)
PUT    /api/categories/:id   → update (admin, manager)
DELETE /api/categories/:id   → delete (admin only)
```

### Orders (requires auth)
```
POST  /api/orders            → create order + checkout (any role)
GET   /api/orders            → all orders (admin, manager)
GET   /api/orders/:id        → single order (any role)
```

---

## 🧠 Business Logic

- **Checkout flow:** validates stock → calculates total → creates order → saves order items → deducts stock, all in a **single DB transaction**
- **Stock guard:** throws error if any product has insufficient quantity before processing
- **JWT payload:** stores `{ id, email, role, name }` — role checked in middleware per route

---

## 🌐 Frontend Features

| Page | Role Access |
|------|-------------|
| Login | Public |
| Dashboard | All |
| POS Checkout | All |
| Products CRUD | Admin, Manager |
| Categories CRUD | Admin, Manager |
| Orders History | Admin, Manager |

---

## ⚙️ Environment Variables

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=pos_system
JWT_SECRET=change_this_to_a_random_secret
JWT_EXPIRES_IN=7d
```
