const healthRecordService = require("../services/healthRecordService")

// Create a new health record
const createHealthRecord = async (req, res) => {
    try {
        const userId = req.user.id
        const recordData = req.body
        const result = await healthRecordService.createHealthRecord(userId, recordData)

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

// Get all health records for a user
const getHealthRecords = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id
        const records = await healthRecordService.getHealthRecords(userId)

        res.status(200).json({
            success: true,
            data: records,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get a specific health record
const getHealthRecordById = async (req, res) => {
    try {
        const recordId = req.params.id
        const userId = req.user.id
        const record = await healthRecordService.getHealthRecordById(recordId, userId)

        res.status(200).json({
            success: true,
            data: record,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

// Update a health record
const updateHealthRecord = async (req, res) => {
    try {
        const recordId = req.params.id
        const userId = req.user.id
        const recordData = req.body
        const updatedRecord = await healthRecordService.updateHealthRecord(recordId, userId, recordData)

        res.status(200).json({
            success: true,
            data: updatedRecord,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Delete a health record
const deleteHealthRecord = async (req, res) => {
    try {
        const recordId = req.params.id
        const userId = req.user.id
        await healthRecordService.deleteHealthRecord(recordId, userId)

        res.status(200).json({
            success: true,
            message: "Health record deleted successfully",
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    createHealthRecord,
    getHealthRecords,
    getHealthRecordById,
    updateHealthRecord,
    deleteHealthRecord,
}

