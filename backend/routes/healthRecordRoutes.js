const express = require("express")
const router = express.Router()
const healthRecordController = require("../controllers/healthRecordController")
const { authenticate, isDoctor, isOwnerOrAdmin } = require("../middleware/authMiddleware")
const { validate, healthRecordValidationRules } = require("../middleware/validationMiddleware")

// Create a new health record
router.post("/", authenticate, healthRecordValidationRules, validate, healthRecordController.createHealthRecord)

// Get all health records for current user
router.get("/", authenticate, healthRecordController.getHealthRecords)

// Get all health records for a specific user (doctor or admin access)
router.get("/user/:userId", authenticate, isDoctor, healthRecordController.getHealthRecords)

// Get a specific health record
router.get("/:id", authenticate, healthRecordController.getHealthRecordById)

// Update a health record
router.put("/:id", authenticate, healthRecordValidationRules, validate, healthRecordController.updateHealthRecord)

// Delete a health record
router.delete("/:id", authenticate, healthRecordController.deleteHealthRecord)

module.exports = router

