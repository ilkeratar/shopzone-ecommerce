import express from "express";
import {
    deleteUser,
    getCurrentUserProfile,
    getUserDetails,
    getUsers,
    updateProfile,
    updateUser
} from "../controllers/userController.js";
import { authorizeRoles, isAuthenticatedUser} from "../middlewares/auth.js";

const router = express.Router();

router.route("/me").get(isAuthenticatedUser,getCurrentUserProfile);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles('admin'), getUsers);
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

export default router;