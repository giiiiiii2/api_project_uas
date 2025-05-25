const userService = require("../services/userService");

// Register a new user
const register = async (req, res) => {
    try {
        const userData = req.body;
        const result = await userService.register(userData);

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                success: false,
                message: "Email already in use",
            });
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userService.getUserById(userId);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const updatedUser = await userService.updateUser(userId, userData);

        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Update password
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        const result = await userService.updatePassword(
            userId,
            currentPassword,
            newPassword
        );

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await userService.deleteUser(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await userService.getAllDoctors();

        res.status(200).json({
            success: true,
            data: doctors,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get doctor categories
const getDoctorCategories = async (req, res) => {
    try {
        const categories = await userService.getDoctorCategories();

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get doctor specializations
const getDoctorSpecializations = async (req, res) => {
    try {
        const specializations = await userService.getDoctorSpecializations();

        res.status(200).json({
            success: true,
            data: specializations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Filter doctors
const filterDoctors = async (req, res) => {
    try {
        const filters = req.query;
        const doctors = await userService.getAllDoctors(filters);

        res.status(200).json({
            success: true,
            data: doctors,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    getUserById,
    updateUser,
    updatePassword,
    deleteUser,
    getAllDoctors,
    getDoctorCategories,
    getDoctorSpecializations,
    filterDoctors,
};
