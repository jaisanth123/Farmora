import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import connectDB from "./config/db.js";
import farmerRoutes from "./routes/farmerRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

// Route
// Define Python API URL
const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

// Forward specific routes to Python FastAPI with explicit target
app.use(
  "/api/coordinates",
  createProxyMiddleware({
    target: PYTHON_API_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/coordinates": "/api/coordinates", // keep the same path
    },
  })
);

app.use(
  "/api/environmental_conditions",
  createProxyMiddleware({
    target: PYTHON_API_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/environmental_conditions": "/api/environmental_conditions", // keep the same path
    },
  })
);

// Add news API proxy
app.use(
  "/api/news",
  createProxyMiddleware({
    target: PYTHON_API_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/news": "/api/news", // keep the same path
    },
  })
);

app.use("/api/farmer", farmerRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Node.js API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Python API URL: ${PYTHON_API_URL}`);
});

// Error handling
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
