# ElectroShop — E-Commerce API Backend

A RESTful backend API for an electronics e-commerce platform. Built with **Node.js + Express**, backed by **MySQL**, and deployed on **Render**.

---

## Features

### Authentication
- Credential-based signup/login with bcrypt password hashing
- JWT-based authentication with role support (`admin` / `user`)
- Protected routes via JWT middleware

### Products (Equipments)
- Full CRUD for products with name, model, serial number, price, stock, image, and description
- Search by name or description (case-insensitive)
- JOIN queries to include category and provider names in responses
- Input validation with regex (supports Vietnamese characters and hyphens)
- Duplicate name detection and foreign key constraint handling

### Categories & Providers
- CRUD for product categories
- CRUD for product providers/suppliers

### Orders
- Checkout with multiple items in a single transaction
- Stock validation before order creation — rejects if any item is out of stock
- MySQL transaction with rollback on failure (atomicity guarantee)
- Payment method support (default: COD)
- Order status management (admin)
- Users can view their own order history with item details

### User & Profile Management
- Admin can view and manage all users
- Users can update their own profile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MySQL (mysql2) |
| Auth | JWT + bcryptjs |
| Deployment | Render |

---

## Project Structure

```
├── config/
│   └── db.js                   # MySQL connection pool
├── controllers/
│   ├── authController.js       # signup, login
│   ├── equipmentController.js  # product CRUD + search
│   ├── categoryController.js   # category CRUD
│   ├── providerController.js   # provider CRUD
│   ├── orderController.js      # checkout + order management
│   ├── userController.js       # user management (admin)
│   └── profileController.js   # user profile
├── middleware/
│   └── authMiddleware.js       # JWT verification + role check
├── routes/
│   ├── authRoutes.js
│   ├── equipmentRoutes.js
│   ├── categoryRoutes.js
│   ├── providerRoutes.js
│   ├── orderRoutes.js
│   ├── userRoutes.js
│   └── profileRoutes.js
└── index.js                    # App entry point, CORS config
```

---

## Getting Started

### Prerequisites
- Node.js
- MySQL

### Environment Variables

Create a `.env` file:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=electroshop
JWT_SECRET=your_jwt_secret
```

### Run

```bash
npm install
npm start
```

---

## API Overview

| Module | Base Path |
|---|---|
| Auth | `/api/auth` |
| Products | `/api/equipments` |
| Categories | `/api/categories` |
| Providers | `/api/providers` |
| Orders | `/api/orders` |
| Users | `/api/users` |
| Profile | `/api/profiles` |

---

## Deployment

- **Backend:** [Render](https://render.com)
- **Frontend:** [Vercel](https://vercel.com) — `https://demo-web-pttk.vercel.app`
