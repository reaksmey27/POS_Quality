const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", authenticate, productController.getAll);
router.get("/:id", authenticate, productController.getById);
router.post("/", authenticate, authorizeRoles(0, 1), productController.create);
router.put("/:id", authenticate, authorizeRoles(0, 1), productController.update);
router.delete("/:id", authenticate, authorizeRoles(0), productController.remove);

module.exports = router;
