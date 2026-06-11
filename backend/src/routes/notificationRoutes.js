const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/", authenticate, notificationController.getLatest);
router.post(
  "/mark-all-read",
  authenticate,
  notificationController.markAllAsRead,
);

module.exports = router;
