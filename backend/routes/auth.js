import express from "express";
import {
    forgotPassword,
    loginUser,
    logOut,
    registerUser,
    resetPassword,
    updatePassword
} from "../controllers/authController.js";
import {isAuthenticatedUser} from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOut);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
export default router;
