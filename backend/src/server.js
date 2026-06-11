require("dotenv").config();
require("reflect-metadata");

const express = require("express");
const cors = require("cors");
const { AppDataSource } = require("./config/data-source");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// API Route Bindings
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date() }),
);

// Fallback 404 Route Handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error("🚨 Error occurred:", err.stack);

  // If it's a validation/business rule error from our services, use a 400 Bad Request
  const badRequestErrors = [
    "not found",
    "required",
    "invalid",
    "already registered",
    "insufficient stock",
  ];
  const errorMessage = err.message.toLowerCase();

  if (badRequestErrors.some((keyword) => errorMessage.includes(keyword))) {
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    return res.status(statusCode).json({ message: err.message });
  }

  // Fallback to 500 for true unhandled system exceptions
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Database Connection & Server Bootstrap
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
