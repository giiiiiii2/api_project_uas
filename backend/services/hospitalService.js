const db = require("../config/database")
const axios = require("axios")

class HospitalService {
    // Add a hospital to favorites
    async addFavoriteHospital(userId, hospitalData) {
        try {
            const [result] = await db.execute(
                "INSERT INTO favorite_hospitals (user_id, hospital_name, hospital_address, hospital_phone, hospital_coordinates) VALUES (?, ?, ?, ?, ?)",
                [
                    userId,
                    hospitalData.hospital_name,
                    hospitalData.hospital_address || null,
                    hospitalData.hospital_phone || null,
                    hospitalData.hospital_coordinates || null,
                ],
            )

            // Get the newly added favorite hospital
            const [hospitals] = await db.execute("SELECT * FROM favorite_hospitals WHERE id = ?", [result.insertId])

            return hospitals[0]
        } catch (error) {
            throw error
        }
    }

    // Get all favorite hospitals for a user
    async getFavoriteHospitals(userId) {
        try {
            const [hospitals] = await db.execute("SELECT * FROM favorite_hospitals WHERE user_id = ?", [userId])

            return hospitals
        } catch (error) {
            throw error
        }
    }

    // Get a specific favorite hospital
    async getFavoriteHospitalById(hospitalId, userId) {
        try {
            const [hospitals] = await db.execute("SELECT * FROM favorite_hospitals WHERE id = ? AND user_id = ?", [
                hospitalId,
                userId,
            ])

            if (hospitals.length === 0) {
                throw new Error("Favorite hospital not found")
            }

            return hospitals[0]
        } catch (error) {
            throw error
        }
    }

    // Update a favorite hospital
    async updateFavoriteHospital(hospitalId, userId, hospitalData) {
        try {
            // Build the query dynamically based on provided fields
            let query = "UPDATE favorite_hospitals SET "
            const values = []
            const fields = []

            for (const [key, value] of Object.entries(hospitalData)) {
                if (value !== undefined) {
                    fields.push(`${key} = ?`)
                    values.push(value)
                }
            }

            // If no fields to update
            if (fields.length === 0) {
                throw new Error("No fields to update")
            }

            query += fields.join(", ")
            query += " WHERE id = ? AND user_id = ?"
            values.push(hospitalId, userId)

            // Execute update query
            const [result] = await db.execute(query, values)

            if (result.affectedRows === 0) {
                throw new Error("Favorite hospital not found or you do not have permission to update it")
            }

            // Get updated favorite hospital
            return await this.getFavoriteHospitalById(hospitalId, userId)
        } catch (error) {
            throw error
        }
    }

    // Delete a favorite hospital
    async deleteFavoriteHospital(hospitalId, userId) {
        try {
            const [result] = await db.execute("DELETE FROM favorite_hospitals WHERE id = ? AND user_id = ?", [
                hospitalId,
                userId,
            ])

            if (result.affectedRows === 0) {
                throw new Error("Favorite hospital not found or you do not have permission to delete it")
            }

            return { success: true }
        } catch (error) {
            throw error
        }
    }

    // Search for nearby hospitals using external API
    async searchNearbyHospitals(latitude, longitude, radius = 5000) {
        try {
            // This is a placeholder for the actual API call
            // You would need to replace this with the actual RapidAPI endpoint
            const response = await axios.get("https://rapidapi.com/hospitals/nearby", {
                params: {
                    lat: latitude,
                    lng: longitude,
                    radius: radius,
                },
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
                },
            })

            return response.data
        } catch (error) {
            throw error
        }
    }
}

module.exports = new HospitalService()

