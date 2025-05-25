const db = require("../config/database")

class MedicationReminderService {
    // Create a new medication reminder
    async createMedicationReminder(userId, reminderData) {
        try {
            // Convert time_slots array to JSON string
            const timeSlots = JSON.stringify(reminderData.time_slots)

            const [result] = await db.execute(
                "INSERT INTO medication_reminders (user_id, medication_name, dosage, frequency, start_date, end_date, time_slots, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    userId,
                    reminderData.medication_name,
                    reminderData.dosage || null,
                    reminderData.frequency,
                    reminderData.start_date,
                    reminderData.end_date || null,
                    timeSlots,
                    reminderData.notes || null,
                ],
            )

            // Get the newly created reminder
            const [reminders] = await db.execute("SELECT * FROM medication_reminders WHERE id = ?", [result.insertId])

            // Parse time_slots back to array
            const reminder = reminders[0]
            reminder.time_slots = JSON.parse(reminder.time_slots)

            return reminder
        } catch (error) {
            throw error
        }
    }

    // Get all medication reminders for a user
    async getMedicationReminders(userId) {
        try {
            const [reminders] = await db.execute(
                "SELECT * FROM medication_reminders WHERE user_id = ? ORDER BY start_date DESC",
                [userId],
            )

            // Parse time_slots for each reminder
            reminders.forEach((reminder) => {
                reminder.time_slots = JSON.parse(reminder.time_slots)
            })

            return reminders
        } catch (error) {
            throw error
        }
    }

    // Get a specific medication reminder
    async getMedicationReminderById(reminderId, userId) {
        try {
            const [reminders] = await db.execute("SELECT * FROM medication_reminders WHERE id = ? AND user_id = ?", [
                reminderId,
                userId,
            ])

            if (reminders.length === 0) {
                throw new Error("Medication reminder not found")
            }

            // Parse time_slots
            const reminder = reminders[0]
            reminder.time_slots = JSON.parse(reminder.time_slots)

            return reminder
        } catch (error) {
            throw error
        }
    }

    // Update a medication reminder
    async updateMedicationReminder(reminderId, userId, reminderData) {
        try {
            // Build the query dynamically based on provided fields
            let query = "UPDATE medication_reminders SET "
            const values = []
            const fields = []

            for (const [key, value] of Object.entries(reminderData)) {
                if (value !== undefined) {
                    // Handle time_slots specially
                    if (key === "time_slots") {
                        fields.push(`${key} = ?`)
                        values.push(JSON.stringify(value))
                    } else {
                        fields.push(`${key} = ?`)
                        values.push(value)
                    }
                }
            }

            // If no fields to update
            if (fields.length === 0) {
                throw new Error("No fields to update")
            }

            query += fields.join(", ")
            query += " WHERE id = ? AND user_id = ?"
            values.push(reminderId, userId)

            // Execute update query
            const [result] = await db.execute(query, values)

            if (result.affectedRows === 0) {
                throw new Error("Medication reminder not found or you do not have permission to update it")
            }

            // Get updated reminder
            return await this.getMedicationReminderById(reminderId, userId)
        } catch (error) {
            throw error
        }
    }

    // Delete a medication reminder
    async deleteMedicationReminder(reminderId, userId) {
        try {
            const [result] = await db.execute("DELETE FROM medication_reminders WHERE id = ? AND user_id = ?", [
                reminderId,
                userId,
            ])

            if (result.affectedRows === 0) {
                throw new Error("Medication reminder not found or you do not have permission to delete it")
            }

            return { success: true }
        } catch (error) {
            throw error
        }
    }

    // Get today's medication reminders for a user
    async getTodayReminders(userId) {
        try {
            const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

            const [reminders] = await db.execute(
                "SELECT * FROM medication_reminders WHERE user_id = ? AND start_date <= ? AND (end_date IS NULL OR end_date >= ?)",
                [userId, today, today],
            )

            // Parse time_slots for each reminder
            reminders.forEach((reminder) => {
                reminder.time_slots = JSON.parse(reminder.time_slots)
            })

            return reminders
        } catch (error) {
            throw error
        }
    }
}

module.exports = new MedicationReminderService()

