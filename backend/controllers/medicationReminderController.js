const medicationReminderService = require("../services/medicationReminderService")

// Create a new medication reminder
const createMedicationReminder = async (req, res) => {
    try {
        const userId = req.user.id
        const reminderData = req.body
        const result = await medicationReminderService.createMedicationReminder(userId, reminderData)

        res.status(201).json({
            success: true,
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get all medication reminders for a user
const getMedicationReminders = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id
        const reminders = await medicationReminderService.getMedicationReminders(userId)

        res.status(200).json({
            success: true,
            data: reminders,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get a specific medication reminder
const getMedicationReminderById = async (req, res) => {
    try {
        const reminderId = req.params.id
        const userId = req.user.id
        const reminder = await medicationReminderService.getMedicationReminderById(reminderId, userId)

        res.status(200).json({
            success: true,
            data: reminder,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

// Update a medication reminder
const updateMedicationReminder = async (req, res) => {
    try {
        const reminderId = req.params.id
        const userId = req.user.id
        const reminderData = req.body
        const updatedReminder = await medicationReminderService.updateMedicationReminder(reminderId, userId, reminderData)

        res.status(200).json({
            success: true,
            data: updatedReminder,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Delete a medication reminder
const deleteMedicationReminder = async (req, res) => {
    try {
        const reminderId = req.params.id
        const userId = req.user.id
        await medicationReminderService.deleteMedicationReminder(reminderId, userId)

        res.status(200).json({
            success: true,
            message: "Medication reminder deleted successfully",
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Get today's medication reminders for a user
const getTodayReminders = async (req, res) => {
    try {
        const userId = req.user.id
        const reminders = await medicationReminderService.getTodayReminders(userId)

        res.status(200).json({
            success: true,
            data: reminders,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    createMedicationReminder,
    getMedicationReminders,
    getMedicationReminderById,
    updateMedicationReminder,
    deleteMedicationReminder,
    getTodayReminders,
}

