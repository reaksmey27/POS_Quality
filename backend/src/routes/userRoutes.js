const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticate,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Admin-only user management
router.get("/", authenticate, authorizeRoles(0), userController.list);
router.get("/:id", authenticate, authorizeRoles(0), userController.getById);
router.post("/", authenticate, authorizeRoles(0), userController.create);
router.put("/:id", authenticate, authorizeRoles(0), userController.update);
router.delete("/:id", authenticate, authorizeRoles(0), userController.remove);

module.exports = router;
