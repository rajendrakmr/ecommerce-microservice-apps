# 🛍️ Arche — E-Commerce Microservice Application

A full-stack e-commerce platform built with a **microservice architecture**, featuring a React + Vite frontend and Node.js backend services orchestrated via Docker Compose.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20MongoDB-green?style=flat-square)
![Docker](https://img.shields.io/badge/Orchestration-Docker%20Compose-2496ED?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📐 Architecture Overview

```
                        ┌─────────────────┐
                        │   React + Vite   │
                        │    Frontend      │
                        │   :3000          │
                        └────────┬────────┘
                                 │ HTTP
                                 ▼
                        ┌─────────────────┐
                        │   API Gateway   │
                        │    :5000        │
                        └────┬──────┬─────┘
                             │      │      
              ┌──────────────┼──────┼──────────────┐
              ▼              ▼      ▼              ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │   Auth   │  │  User    │  │ Product  │
       │ Service  │  │ Service  │  │ Service  │
       │  :5001   │  │  :5002   │  │  :5003   │
       └────┬─────┘  └────┬─────┘  └────┬─────┘
            └─────────────┴─────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   MongoDB     │
                  │   :27017      │
                  └───────────────┘
```

---

## 📦 Project Structure

```
ecommerce-microservice-apps/
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   ├── components/          # Reusable UI components
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── api-gateway/             # Central entry point & request router
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── routes/
│   │   │   └── middleware/
│   │   ├── Dockerfile-slim
│   │   └── package.json
│   │
│   ├── auth-service/            # JWT authentication & authorization
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   └── middleware/
│   │   ├── Dockerfile-slim
│   │   └── package.json
│   │
│   ├── user-service/            # User profile management
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── routes/
│   │   │   └── models/
│   │   ├── Dockerfile-slim
│   │   └── package.json
│   │
│   └── product-service/         # Product catalog management
│   |   ├── src/
│   |   │   ├── index.js
│   |   │   ├── routes/
│   |   │   └── models/
│   |   ├── Dockerfile-slim
│   |   └── package.json
│   ├── order-service/            # Order history management
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── routes/
│   │   │   └── models/
│   │   ├── Dockerfile-slim
│   │   └── package.json
│   │
│   └── cart-service/         # Shopping cart management
│       ├── src/
│       │   ├── index.js
│       │   ├── routes/
│       │   └── models/
│       ├── Dockerfile-slim
│       └── package.json
│
└── docker-compose.yml
```

---

## 🚀 Services

| Service | Port | Description |
|---|---|---|
| **Frontend** | `5173` | React + Vite SPA |
| **API Gateway** | `5000` | Routes all client requests to microservices |
| **Auth Service** | `5001` | User registration, login, JWT token management |
| **User Service** | `5002` | User profile CRUD operations |
| **Product Service** | `5003` | Product catalog, search, filtering |
| **Cart Service** | `5004` | Manage shopping cart: add/remove items, view cart, calculate totals |
| **Order Service** | `5005` | Handle orders: create, confirm, track, and process payments |
| **MongoDB** | `27017` | Shared database (containerized) |

---

## 🔌 API Reference

All client requests go through the **API Gateway** on port `5000`.

### Auth Endpoints → `http://localhost:5000/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login and receive JWT token | ❌ |
| `POST` | `/auth/logout` | Invalidate session | ✅ |
| `GET` | `/auth/me` | Get current user from token | ✅ |
| `POST` | `/auth/refresh` | Refresh access token | ✅ |

**Register request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Login response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

---

### User Endpoints → `http://localhost:5000/users`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/users/profile` | Get current user profile | ✅ |
| `PUT` | `/users/profile` | Update profile details | ✅ |
| `DELETE` | `/users/profile` | Delete account | ✅ |
| `GET` | `/users/:id` | Get user by ID (admin) | ✅ Admin |
| `GET` | `/users` | List all users (admin) | ✅ Admin |

**Update profile request body:**
```json
{
  "name": "Jane Smith",
  "phone": "+1-555-0100",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001",
    "country": "US"
  }
}
```

---

### Product Endpoints → `http://localhost:5000/products`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/products` | List all products (with filters) | ❌ |
| `GET` | `/products/:id` | Get single product | ❌ |
| `POST` | `/products` | Create a product (admin) | ✅ Admin |
| `PUT` | `/products/:id` | Update a product (admin) | ✅ Admin |
| `DELETE` | `/products/:id` | Delete a product (admin) | ✅ Admin |
| `GET` | `/products/search?q=` | Search products by name | ❌ |
| `GET` | `/products/category/:cat` | Filter by category | ❌ |

**Query parameters for `GET /products`:**
```
?category=Electronics
?sort=price-asc | price-desc | rating | newest
?page=1&limit=12
?minPrice=50&maxPrice=500
?search=wireless
```

**Product object:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "name": "Wireless Earbuds Pro",
  "description": "40hr battery, adaptive ANC, spatial audio.",
  "price": 249,
  "category": "Electronics",
  "stock": 30,
  "rating": 4.6,
  "reviews": 1203,
  "images": ["https://cdn.example.com/product1.jpg"],
  "createdAt": "2025-01-15T10:00:00Z"
}
```


 
### Cart Endpoints → `http://localhost:5004/cart`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/cart` | List all items in the user’s cart | ✅ User |
| `GET` | `/cart/:id` | Get single cart item by ID | ✅ User |
| `POST` | `/cart` | Add a new item to the cart | ✅ User |
| `PUT` | `/cart/:id` | Update quantity of a cart item | ✅ User |
| `DELETE` | `/cart/:id` | Remove an item from the cart | ✅ User |
| `DELETE` | `/cart` | Clear all items from the cart | ✅ User |

**Query parameters for `GET /cart`:**

**Query parameters for `GET /products`:**
```
?page=1&limit=10
?sort=addedAt-desc | addedAt-asc
?productId=
```

 
**Cart item object example:**
```json
{
  "_id": "64f3d2e4f5a6b7c8d9e0f1a2",
  "productId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "name": "Wireless Earbuds Pro",
  "price": 249,
  "quantity": 2,
  "total": 498,
  "addedAt": "2026-03-13T12:00:00Z"
}
```


### Order Endpoints → `http://localhost:5005/orders`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/orders` | List all orders for the user | ✅ User |
| `GET` | `/orders/:id` | Get details of a single order | ✅ User |
| `POST` | `/orders` | Create a new order from cart | ✅ User |
| `PUT` | `/orders/:id/cancel` | Cancel an order | ✅ User |
| `PUT` | `/orders/:id/status` | Update order status (admin only) | ✅ Admin |
| `GET` | `/orders/search?q=` | Search orders by product or user | ✅ Admin |

**Query parameters for `GET /orders`:**

?page=1&limit=10
?sort=createdAt-desc | createdAt-asc
?status=Pending | Shipped | Delivered | Cancelled
?userId=<user_id>```


**Order object example:**
```json
{
  "_id": "64f2c3d4e5f6a7b8c9d0e1f2",
  "userId": "64f1b2c3d4e5f6a7b8c9d0e1",
  "items": [
    {
      "productId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Wireless Earbuds Pro",
      "price": 249,
      "quantity": 2,
      "total": 498
    }
  ],
  "totalPrice": 498,
  "status": "Pending",
  "createdAt": "2026-03-13T12:30:00Z",
  "updatedAt": "2026-03-13T12:30:00Z"
}
```

---

## 🐳 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Node.js](https://nodejs.org/) v22+ (for local dev without Docker)
- [Git](https://git-scm.com/)

### 1. Clone the repository 

```bash
git clone https://github.com/rajendrakmr/ecommerce-microservice-apps.git
cd ecommerce-microservice-apps
```

### 2. Start all services with Docker Compose

```bash
docker-compose up --build
```

This spins up MongoDB, all three backend services, and the API Gateway. The first build may take a few minutes.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

### 4. Verify services are running

```bash
# Check all containers
docker ps

# Test API Gateway health
curl http://localhost:5000/health

# Test auth service directly
curl http://localhost:5001/health
```

---

## ⚙️ Environment Variables

Each service reads its config from environment variables. In production, use a `.env` file or secrets manager.

### API Gateway (`backend/api-gateway/.env`)
```env
PORT=5000
AUTH_SERVICE_URL=http://auth-service:5001/auth
USER_SERVICE_URL=http://user-service:5002
PRODUCT_SERVICE_URL=http://product-service:5003
CART_SERVICE_URL=http://cart-service:5004
ORDER_SERVICE_URL=http://order-service:5005
JWT_SECRET=your_jwt_secret_here
```

### Auth Service (`backend/auth-service/.env`)
```env
PORT=5001
MONGO_URI=mongodb://admin:admin123@mongodb:27017/authdb?authSource=admin
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### User Service (`backend/user-service/.env`)
```env
PORT=5002
MONGO_URI=mongodb://admin:admin123@mongodb:27017/userdb?authSource=admin
JWT_SECRET=your_jwt_secret_here
```

### Product Service (`backend/product-service/.env`)
```env
PORT=5003
MONGO_URI=mongodb://admin:admin123@mongodb:27017/productdb?authSource=admin
```

> ⚠️ **Important:** Change `admin123` and `JWT_SECRET` before deploying to production.

---

## 🧑‍💻 Local Development (without Docker)

If you want to run individual services locally for faster iteration:

```bash
# Terminal 1 — start MongoDB (still via Docker)
docker-compose up mongodb

# Terminal 2 — Auth service
cd backend/auth-service
npm install
npm run dev

# Terminal 3 — User service
cd backend/user-service
npm install
npm run dev

# Terminal 4 — Product service
cd backend/product-service
npm install
npm run dev

# Terminal 5 — API Gateway
cd backend/api-gateway
npm install
npm run dev

# Terminal 6 — Frontend
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing the API

### Register a new user

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get all products

```bash
curl http://localhost:5000/products
```

### Get products with filter

```bash
curl "http://localhost:5000/products?category=Electronics&sort=price-asc&limit=5"
```

### Get your profile (requires token)

```bash
curl http://localhost:5000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create a product (admin only)

```bash
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Product description here.",
    "price": 99,
    "category": "Electronics",
    "stock": 50
  }'
```

---

## 🔐 Authentication Flow

``` 
Client                 API Gateway             Auth Service           MongoDB
  │                        │                        │                    │
  │── POST /auth/login ──► │                        │                    │
  │                        │── forward request ───► │                    │
  │                        │                        │── find user ─────► │
  │                        │                        │◄─ user data ────── │
  │                        │                        │── verify password   │
  │                        │◄── JWT token ─────────  │                    │
  │◄── JWT token ─────────  │                        │                    │
  │                        │                        │                    │
  │── GET /users/profile ──►│                        │                    │
  │   Authorization: Bearer │── validate token ────► │                    │
  │                        │◄── valid / invalid ───  │                    │
  │                        │── forward to user-svc   │                    │
  │◄── profile data ───────  │                        │                    │
  │                        │                        │                    │
  │── GET /cart ──────────►│                        │                    │
  │   Authorization: Bearer │── validate token ────► │                    │
  │                        │◄── valid / invalid ───  │                    │
  │                        │── forward to cart-svc   │                    │
  │                        │                        │── fetch cart ──► │
  │                        │                        │◄─ cart items ───── │
  │◄── cart data ─────────  │                        │                    │
  │                        │                        │                    │
  │── POST /orders ───────►│                        │                    │
  │   Authorization: Bearer │── validate token ────► │                    │
  │                        │◄── valid / invalid ───  │                    │
  │                        │── forward to order-svc  │                    │
  │                        │                        │── create order ─► │
  │                        │                        │◄─ order data ───── │
  │◄── order confirmation ─ │                        │                    │

All protected routes require the `Authorization: Bearer <token>` header. The API Gateway validates the token against the Auth Service before forwarding requests.

---

## 🗂️ Data Models

### User
```javascript
{
  _id: ObjectId,
  name: String,        // required
  email: String,       // required, unique
  password: String,    // bcrypt hashed
  role: String,        // "customer" | "admin"
  address: {
    street: String,
    city: String,
    zip: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  name: String,        // required
  description: String,
  price: Number,       // required
  category: String,    // required
  stock: Number,       // default: 0
  rating: Number,      // 0–5
  reviews: Number,
  images: [String],    // array of image URLs
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐳 Docker Compose Reference

```yaml
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild images after code changes
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (resets database)
docker-compose down -v

# View logs for a specific service
docker-compose logs -f api-gateway
docker-compose logs -f auth-service

# Restart a single service
docker-compose restart product-service

# Open a shell in a container
docker exec -it api-gateway sh
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19+, Vite, Context API |
| API Gateway | Node.js, Express |
| Auth Service | Node.js, Express, JWT, bcrypt |
| User Service | Node.js, Express, Mongoose |
| Product Service | Node.js, Express, Mongoose |
| Database | MongoDB |
| Containerization | Docker, Docker Compose |
| Network | Custom Docker bridge network (`ecommerce-nt`) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/order-service`)
3. Commit your changes (`git commit -m 'Add order service'`)
4. Push to the branch (`git push origin feature/order-service`)
5. Open a Pull Request

---


<p align="center">Built with ❤️ by <a href="https://github.com/rajendrakmr">rajendrakmr</a></p>