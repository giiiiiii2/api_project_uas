const express = require("express")
const router = express.Router()
const medicationReminderController = require("../controllers/medicationReminderController")
const { authenticate, isDoctor, isOwnerOrAdmin } = require("../middleware/authMiddleware")
const { validate, medicationReminderValidationRules } = require("../middleware/validationMiddleware")

// Create a new medication reminder
router.post(
    "/",
    authenticate,
    medicationReminderValidationRules,
    validate,
    medicationReminderController.createMedicationReminder,
)

// Get all medication reminders for current user
router.get("/", authenticate, medicationReminderController.getMedicationReminders)

// Get today's medication reminders
router.get("/today", authenticate, medicationReminderController.getTodayReminders)

// Get all medication reminders for a specific user (doctor or admin access)
router.get("/user/:userId", authenticate, isDoctor, medicationReminderController.getMedicationReminders)

// Get a specific medication reminder
router.get("/:id", authenticate, medicationReminderController.getMedicationReminderById)

// Update a medication reminder
router.put(
    "/:id",
    authenticate,
    medicationReminderValidationRules,
    validate,
    medicationReminderController.updateMedicationReminder,
)

// Delete a medication reminder
router.delete("/:id", authenticate, medicationReminderController.deleteMedicationReminder)

module.exports = router

