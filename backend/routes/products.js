import express from "express";
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} from "../controllers/productControllers.js";
import { authorizedUser, isAuthenticatedUser} from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(isAuthenticatedUser, getProducts);
router.route("/products/:id").get(isAuthenticatedUser, getProduct);

router.route("/admin/products").post(isAuthenticatedUser, authorizedUser("admin"), createProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser, authorizedUser("admin"), updateProduct);
router.route("/admin/products/:id").delete(isAuthenticatedUser, authorizedUser("admin"), deleteProduct);
export default router;