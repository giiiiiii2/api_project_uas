const db = require("../config/database")

class DoctorConsultationService {
    // Create a new doctor consultation
    async createConsultation(userId, consultationData) {
        try {
            const [result] = await db.execute(
                "INSERT INTO doctor_consultations (user_id, doctor_id, consultation_date, consultation_time, reason, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    userId,
                    consultationData.doctor_id || null,
                    consultationData.consultation_date,
                    consultationData.consultation_time,
                    consultationData.reason || null,
                    consultationData.status || "scheduled",
                    consultationData.notes || null,
                ],
            )

            // Get the newly created consultation
            const [consultations] = await db.execute("SELECT * FROM doctor_consultations WHERE id = ?", [result.insertId])

            return consultations[0]
        } catch (error) {
            throw error
        }
    }

    // Get all consultations for a user
    async getConsultations(userId) {
        try {
            const [consultations] = await db.execute(
                "SELECT c.*, u.name as doctor_name FROM doctor_consultations c LEFT JOIN users u ON c.doctor_id = u.id WHERE c.user_id = ? ORDER BY c.consultation_date DESC, c.consultation_time DESC",
                [userId],
            )

            return consultations
        } catch (error) {
            throw error
        }
    }

    // Get all consultations for a doctor
    async getDoctorConsultations(doctorId) {
        try {
            const [consultations] = await db.execute(
                "SELECT c.*, u.name as patient_name FROM doctor_consultations c JOIN users u ON c.user_id = u.id WHERE c.doctor_id = ? ORDER BY c.consultation_date DESC, c.consultation_time DESC",
                [doctorId],
            )

            return consultations
        } catch (error) {
            throw error
        }
    }

    // Get a specific consultation
    async getConsultationById(consultationId, userId) {
        try {
            const [consultations] = await db.execute(
                "SELECT c.*, u.name as doctor_name FROM doctor_consultations c LEFT JOIN users u ON c.doctor_id = u.id WHERE c.id = ? AND c.user_id = ?",
                [consultationId, userId],
            )

            if (consultations.length === 0) {
                throw new Error("Consultation not found")
            }

            return consultations[0]
        } catch (error) {
            throw error
        }
    }

    // Update a consultation
    async updateConsultation(consultationId, userId, consultationData) {
        try {
            // Build the query dynamically based on provided fields
            let query = "UPDATE doctor_consultations SET "
            const values = []
            const fields = []

            for (const [key, value] of Object.entries(consultationData)) {
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
            values.push(consultationId, userId)

            // Execute update query
            const [result] = await db.execute(query, values)

            if (result.affectedRows === 0) {
                throw new Error("Consultation not found or you do not have permission to update it")
            }

            // Get updated consultation
            return await this.getConsultationById(consultationId, userId)
        } catch (error) {
            throw error
        }
    }

    // Update a consultation status (for doctors)
    async updateConsultationStatus(consultationId, doctorId, status) {
        try {
            const [result] = await db.execute("UPDATE doctor_consultations SET status = ? WHERE id = ? AND doctor_id = ?", [
                status,
                consultationId,
                doctorId,
            ])

            if (result.affectedRows === 0) {
                throw new Error("Consultation not found or you do not have permission to update it")
            }

            // Get updated consultation
            const [consultations] = await db.execute(
                "SELECT c.*, u.name as patient_name FROM doctor_consultations c JOIN users u ON c.user_id = u.id WHERE c.id = ? AND c.doctor_id = ?",
                [consultationId, doctorId],
            )

            return consultations[0]
        } catch (error) {
            throw error
        }
    }

    // Delete a consultation
    async deleteConsultation(consultationId, userId) {
        try {
            const [result] = await db.execute("DELETE FROM doctor_consultations WHERE id = ? AND user_id = ?", [
                consultationId,
                userId,
            ])

            if (result.affectedRows === 0) {
                throw new Error("Consultation not found or you do not have permission to delete it")
            }

            return { success: true }
        } catch (error) {
            throw error
        }
    }

    // Get upcoming consultations for a user
    async getUpcomingConsultations(userId) {
        try {
            const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

            const [consultations] = await db.execute(
                'SELECT c.*, u.name as doctor_name FROM doctor_consultations c LEFT JOIN users u ON c.doctor_id = u.id WHERE c.user_id = ? AND c.consultation_date >= ? AND c.status = "scheduled" ORDER BY c.consultation_date ASC, c.consultation_time ASC',
                [userId, today],
            )

            return consultations
        } catch (error) {
            throw error
        }
    }
}

module.exports = new DoctorConsultationService()

