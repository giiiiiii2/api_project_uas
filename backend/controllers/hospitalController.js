const hospitalService = require("../services/hospitalService")

// Add a hospital to favorites
const addFavoriteHospital = async (req, res) => {
    try {
        const userId = req.user.id
        const hospitalData = req.body
        const result = await hospitalService.addFavoriteHospital(userId, hospitalData)

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

// Get all favorite hospitals for a user
const getFavoriteHospitals = async (req, res) => {
    try {
        const userId = req.user.id
        const hospitals = await hospitalService.getFavoriteHospitals(userId)

        res.status(200).json({
            success: true,
            data: hospitals,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get a specific favorite hospital
const getFavoriteHospitalById = async (req, res) => {
    try {
        const hospitalId = req.params.id
        const userId = req.user.id
        const hospital = await hospitalService.getFavoriteHospitalById(hospitalId, userId)

        res.status(200).json({
            success: true,
            data: hospital,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

// Update a favorite hospital
const updateFavoriteHospital = async (req, res) => {
    try {
        const hospitalId = req.params.id
        const userId = req.user.id
        const hospitalData = req.body
        const updatedHospital = await hospitalService.updateFavoriteHospital(hospitalId, userId, hospitalData)

        res.status(200).json({
            success: true,
            data: updatedHospital,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Delete a favorite hospital
const deleteFavoriteHospital = async (req, res) => {
    try {
        const hospitalId = req.params.id
        const userId = req.user.id
        await hospitalService.deleteFavoriteHospital(hospitalId, userId)

        res.status(200).json({
            success: true,
            message: "Favorite hospital deleted successfully",
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Search for nearby hospitals
const searchNearbyHospitals = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required",
            })
        }

        const hospitals = await hospitalService.searchNearbyHospitals(
            Number.parseFloat(latitude),
            Number.parseFloat(longitude),
            radius ? Number.parseInt(radius) : undefined,
        )

        res.status(200).json({
            success: true,
            data: hospitals,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    addFavoriteHospital,
    getFavoriteHospitals,
    getFavoriteHospitalById,
    updateFavoriteHospital,
    deleteFavoriteHospital,
    searchNearbyHospitals,
}

