const express = require("express")
const router = express.Router()
const doctorConsultationController = require("../controllers/doctorConsultationController")
const { authenticate, isDoctor } = require("../middleware/authMiddleware")
const { validate, consultationValidationRules } = require("../middleware/validationMiddleware")

// Create a new consultation
router.post("/", authenticate, consultationValidationRules, validate, doctorConsultationController.createConsultation)

// Get all consultations for current user
router.get("/", authenticate, doctorConsultationController.getConsultations)

// Get upcoming consultations for current user
router.get("/upcoming", authenticate, doctorConsultationController.getUpcomingConsultations)

// Get all consultations for a doctor
router.get("/doctor", authenticate, isDoctor, doctorConsultationController.getDoctorConsultations)

// Get a specific consultation
router.get("/:id", authenticate, doctorConsultationController.getConsultationById)

// Update a consultation
router.put("/:id", authenticate, consultationValidationRules, validate, doctorConsultationController.updateConsultation)

// Update a consultation status (for doctors)
router.patch("/:id/status", authenticate, isDoctor, doctorConsultationController.updateConsultationStatus)

// Delete a consultation
router.delete("/:id", authenticate, doctorConsultationController.deleteConsultation)

module.exports = router

