const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", authenticate, categoryController.getAll);
router.get("/:id", authenticate, categoryController.getById);
router.post("/", authenticate, authorizeRoles(0, 1), categoryController.create);
router.put("/:id", authenticate, authorizeRoles(0, 1), categoryController.update);
router.delete("/:id", authenticate, authorizeRoles(0), categoryController.remove);

module.exports = router;
