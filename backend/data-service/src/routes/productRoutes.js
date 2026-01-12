// data-service/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, restrictTo } = require("../../auth-service/middlewares/auth"); // adjust relative path if needed

// PUBLIC / authenticated view (decide if protect or not)
router.get("/", protect, productController.getProducts);
router.get("/:id", protect, productController.getProduct);

// ADMIN ONLY
router.post("/", protect, restrictTo("admin"), productController.createProduct);
router.put("/:id", protect, restrictTo("admin"), productController.updateProduct);
router.delete("/:id", protect, restrictTo("admin"), productController.deleteProduct);

module.exports = router;
