const db = require("../config/database")

class HealthRecordService {
    // Create a new health record
    async createHealthRecord(userId, recordData) {
        try {
            const [result] = await db.execute(
                "INSERT INTO health_records (user_id, record_date, symptoms, diagnosis, treatment, notes) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    userId,
                    recordData.record_date,
                    recordData.symptoms || null,
                    recordData.diagnosis || null,
                    recordData.treatment || null,
                    recordData.notes || null,
                ],
            )

            // Get the newly created record
            const [records] = await db.execute("SELECT * FROM health_records WHERE id = ?", [result.insertId])

            return records[0]
        } catch (error) {
            throw error
        }
    }

    // Get all health records for a user
    async getHealthRecords(userId) {
        try {
            const [records] = await db.execute("SELECT * FROM health_records WHERE user_id = ? ORDER BY record_date DESC", [
                userId,
            ])

            return records
        } catch (error) {
            throw error
        }
    }

    // Get a specific health record
    async getHealthRecordById(recordId, userId) {
        try {
            const [records] = await db.execute("SELECT * FROM health_records WHERE id = ? AND user_id = ?", [
                recordId,
                userId,
            ])

            if (records.length === 0) {
                throw new Error("Health record not found")
            }

            return records[0]
        } catch (error) {
            throw error
        }
    }

    // Update a health record
    async updateHealthRecord(recordId, userId, recordData) {
        try {
            // Build the query dynamically based on provided fields
            let query = "UPDATE health_records SET "
            const values = []
            const fields = []

            for (const [key, value] of Object.entries(recordData)) {
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
            values.push(recordId, userId)

            // Execute update query
            const [result] = await db.execute(query, values)

            if (result.affectedRows === 0) {
                throw new Error("Health record not found or you do not have permission to update it")
            }

            // Get updated record
            return await this.getHealthRecordById(recordId, userId)
        } catch (error) {
            throw error
        }
    }

    // Delete a health record
    async deleteHealthRecord(recordId, userId) {
        try {
            const [result] = await db.execute("DELETE FROM health_records WHERE id = ? AND user_id = ?", [recordId, userId])

            if (result.affectedRows === 0) {
                throw new Error("Health record not found or you do not have permission to delete it")
            }

            return { success: true }
        } catch (error) {
            throw error
        }
    }
}

module.exports = new HealthRecordService()

