import express from "express";
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} from "../controllers/productControllers.js";
const router= express.Router();

router.route("/products").get(getProducts);
router.route("/products/:id").get(getProduct);
router.route("/admin/products").post(createProduct);
router.route("/products/:id").put(updateProduct);
router.route("/products/:id").delete(deleteProduct);
export default router;