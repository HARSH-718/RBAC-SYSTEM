const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const authorizePermission = require("./middleware/permissionMiddleware");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("RBAC Backend Running...");
});

// Protected Route
app.get("/api/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Protected Route Access Granted",
    user: req.user,
  });
});

// ==========================
// Super Admin Route
// ==========================
app.get(
  "/api/super-admin",
  verifyToken,
  authorizeRoles("super_admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Super Admin",
    });
  }
);

// ==========================
// Admin Route
// ==========================
app.get(
  "/api/admin",
  verifyToken,
  authorizeRoles("super_admin", "admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Admin",
    });
  }
);

// ==========================
// User Route
// ==========================
app.get(
  "/api/user",
  verifyToken,
  authorizeRoles("super_admin", "admin", "user"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome User",
    });
  }
);
app.use("/api/users", userRoutes);

app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});