import express from "express"
import { adminOnly, protect } from "../middleware/auth.middleware.js"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js"
import upload from "../middleware/upload.middleware.js"

const router = express.Router()

// Public
router.get("/", getProducts)
router.get("/:id", getProductById)

// Admin
router.post("/", protect, adminOnly, upload.single("iamge"), createProduct)
router.put("/:id", protect, adminOnly, updateProduct)
router.delete("/:id", protect, adminOnly, deleteProduct)

export default router