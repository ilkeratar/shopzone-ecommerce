import express from "express";
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser} from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(isAuthenticatedUser, getProducts);
router.route("/products/:id").get(isAuthenticatedUser, getProduct);

router.route("/admin/products").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.route("/admin/products/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
export default router;