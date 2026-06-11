const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  authenticate,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.post("/", authenticate, orderController.create);
router.get("/", authenticate, authorizeRoles(0, 1), orderController.getAll);
router.get(
  "/recent",
  authenticate,
  authorizeRoles(0, 1, 2),
  orderController.getRecentCompleted,
);
router.get(
  "/sales/hourly/today",
  authenticate,
  authorizeRoles(0, 1, 2),
  orderController.getHourlySalesToday,
);
router.get("/:id", authenticate, orderController.getById);

module.exports = router;
