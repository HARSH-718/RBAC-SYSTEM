const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
  "/",
  verifyToken,
  authorizeRoles("super_admin", "admin"),
  getDashboard
);

module.exports = router;