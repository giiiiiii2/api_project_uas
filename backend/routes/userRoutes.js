const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
    authenticate,
    isAdmin,
    isOwnerOrAdmin,
} = require("../middleware/authMiddleware");
const {
    validate,
    userValidationRules,
} = require("../middleware/validationMiddleware");

// Public routes
router.post(
    "/register",
    userValidationRules.register,
    validate,
    userController.register
);
router.post(
    "/login",
    userValidationRules.login,
    validate,
    userController.login
);

// Protected routes
router.get("/me", authenticate, userController.getCurrentUser);

// Ubah route untuk mendapatkan dokter agar dapat diakses publik
router.get("/doctors", userController.getAllDoctors);

// Tambahkan routes baru untuk fitur multi-role
router.get("/doctors/categories", userController.getDoctorCategories);
router.get("/doctors/specializations", userController.getDoctorSpecializations);
router.get("/doctors/filter", userController.filterDoctors);

// Admin and owner routes
router.get("/:id", authenticate, isOwnerOrAdmin, userController.getUserById);
router.put(
    "/:id",
    authenticate,
    isOwnerOrAdmin,
    userValidationRules.update,
    validate,
    userController.updateUser
);
router.delete("/:id", authenticate, isOwnerOrAdmin, userController.deleteUser);

// Password update route
router.put("/me/password", authenticate, userController.updatePassword);

module.exports = router;
