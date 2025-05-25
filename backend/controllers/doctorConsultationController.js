const doctorConsultationService = require("../services/doctorConsultationService")

// Create a new doctor consultation
const createConsultation = async (req, res) => {
    try {
        const userId = req.user.id
        const consultationData = req.body
        const result = await doctorConsultationService.createConsultation(userId, consultationData)

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

// Get all consultations for a user
const getConsultations = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id
        const consultations = await doctorConsultationService.getConsultations(userId)

        res.status(200).json({
            success: true,
            data: consultations,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get all consultations for a doctor
const getDoctorConsultations = async (req, res) => {
    try {
        const doctorId = req.user.id
        const consultations = await doctorConsultationService.getDoctorConsultations(doctorId)

        res.status(200).json({
            success: true,
            data: consultations,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get a specific consultation
const getConsultationById = async (req, res) => {
    try {
        const consultationId = req.params.id
        const userId = req.user.id
        const consultation = await doctorConsultationService.getConsultationById(consultationId, userId)

        res.status(200).json({
            success: true,
            data: consultation,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

// Update a consultation
const updateConsultation = async (req, res) => {
    try {
        const consultationId = req.params.id
        const userId = req.user.id
        const consultationData = req.body
        const updatedConsultation = await doctorConsultationService.updateConsultation(
            consultationId,
            userId,
            consultationData,
        )

        res.status(200).json({
            success: true,
            data: updatedConsultation,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Update a consultation status (for doctors)
const updateConsultationStatus = async (req, res) => {
    try {
        const consultationId = req.params.id
        const doctorId = req.user.id
        const { status } = req.body

        if (!status || !["scheduled", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status is required (scheduled, completed, or cancelled)",
            })
        }

        const updatedConsultation = await doctorConsultationService.updateConsultationStatus(
            consultationId,
            doctorId,
            status,
        )

        res.status(200).json({
            success: true,
            data: updatedConsultation,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Delete a consultation
const deleteConsultation = async (req, res) => {
    try {
        const consultationId = req.params.id
        const userId = req.user.id
        await doctorConsultationService.deleteConsultation(consultationId, userId)

        res.status(200).json({
            success: true,
            message: "Consultation deleted successfully",
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Get upcoming consultations for a user
const getUpcomingConsultations = async (req, res) => {
    try {
        const userId = req.user.id
        const consultations = await doctorConsultationService.getUpcomingConsultations(userId)

        res.status(200).json({
            success: true,
            data: consultations,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    createConsultation,
    getConsultations,
    getDoctorConsultations,
    getConsultationById,
    updateConsultation,
    updateConsultationStatus,
    deleteConsultation,
    getUpcomingConsultations,
}

