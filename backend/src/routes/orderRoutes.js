const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/", authenticate, orderController.create);
router.get("/", authenticate, authorizeRoles(0, 1), orderController.getAll);
router.get("/:id", authenticate, orderController.getById);

module.exports = router;
