# Aflaguard Backend

This is the backend of **Aflaguard**, a Node.js-based platform designed to predict aflatoxin levels in grains, manage user data, and process batch orders efficiently.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB or your preferred database
- Yarn or npm

### Installation

```bash
git clone https://github.com/your-org/aflaguard-backend.git
cd aflaguard-backend
npm install

```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Running the Server

```bash
npm run dev
# or
yarn dev
```

The backend will start on `http://localhost:5000`.

---

## 📁 Project Structure

```
aflaguard-backend/
│
├── controllers/        # API route controllers
├── models/             # Mongoose models (User, Batch, Order, etc.)
├── routes/             # Route definitions
├── middleware/         # Custom middlewares
├── utils/              # Utility functions
├── config/             # Configuration files
├── .env                # Environment variables
└── server.js           # Entry point
```

---

## 📦 API Endpoints

### 🔹 User APIs

- `POST /api/users/register` – Register a new user
- `POST /api/users/login` – Login user
- `GET /api/users/profile` – Get user profile

### 🔹 Batch APIs

- `POST /api/batches` – Submit a new batch for testing
- `GET /api/batches/:id` – Get a specific batch by ID
- `GET /api/batches` – Get all batches
- `PATCH /api/batches/:id` – Update batch info/status

### 🔹 Order APIs

- `POST /api/orders` – Create new order
- `GET /api/orders/:id` – Get specific order
- `GET /api/orders` – Get all orders
- `PUT /api/orders/:id/status` – Update order status

---

## 🧭 Navigating the Project

- **`server.js`** – Initializes the app, sets up middleware, and connects routes.
- **`routes/`** – Contains route entry points that link to controllers.
- **`controllers/`** – Logic for handling requests and responses.
- **`models/`** – Mongoose schemas for Users, Orders, and Batches.
- **`middleware/`** – Authentication and error handling middleware.

---

## 👥 Contributors

- Kwihangana Dimitri


---

## 📃 License

MIT License
