import express from "express";
import {
    createProduct, createProductReview,
    deleteProduct, deleteProductReview,
    getProduct, getProductReviews,
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
router.route("/reviews")
    .get(isAuthenticatedUser, getProductReviews)
    .put(isAuthenticatedUser, createProductReview);
router.route("/admin/reviews")
    .delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProductReview)
export default router;