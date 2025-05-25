const db = require("../config/database")
const bcrypt = require("bcrypt")
const { generateToken } = require("../config/auth")

class UserService {
    // Register a new user with role
    async register(userData) {
        try {
            // Hash password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(userData.password, salt)

            // Set default role if not provided
            const role = userData.role || "patient"

            // Insert user into database
            const [result] = await db.execute(
                "INSERT INTO users (name, email, password, phone, address, date_of_birth, gender, role, specialization, practice_years, doctor_license, doctor_bio, consultation_fee, available_days, available_hours, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    userData.name,
                    userData.email,
                    hashedPassword,
                    userData.phone || null,
                    userData.address || null,
                    userData.date_of_birth || null,
                    userData.gender || null,
                    role,
                    userData.specialization || null,
                    userData.practice_years || null,
                    userData.doctor_license || null,
                    userData.doctor_bio || null,
                    userData.consultation_fee || null,
                    userData.available_days || null,
                    userData.available_hours || null,
                    userData.category || null,
                ],
            )

            // Get the newly created user (without password)
            const [user] = await db.execute(
                "SELECT id, name, email, role, phone, address, date_of_birth, gender, profile_picture, created_at FROM users WHERE id = ?",
                [result.insertId],
            )

            // Generate JWT token
            const token = generateToken(user[0].id, user[0].role)

            return {
                user: user[0],
                token,
            }
        } catch (error) {
            throw error
        }
    }

    // Login user
    async login(email, password) {
        try {
            // Find user by email
            const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email])

            if (users.length === 0) {
                throw new Error("Invalid email or password")
            }

            const user = users[0]

            // Check password
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                throw new Error("Invalid email or password")
            }

            // Remove password from user object
            delete user.password

            // Generate JWT token
            const token = generateToken(user.id, user.role)

            return {
                user,
                token,
            }
        } catch (error) {
            throw error
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            const [users] = await db.execute(
                "SELECT id, name, email, role, phone, address, date_of_birth, gender, profile_picture, created_at FROM users WHERE id = ?",
                [userId],
            )

            if (users.length === 0) {
                throw new Error("User not found")
            }

            return users[0]
        } catch (error) {
            throw error
        }
    }

    // Update user
    async updateUser(userId, userData) {
        try {
            // Build the query dynamically based on provided fields
            let query = "UPDATE users SET "
            const values = []
            const fields = []

            for (const [key, value] of Object.entries(userData)) {
                // Skip password as it requires special handling
                if (key !== "password" && value !== undefined) {
                    fields.push(`${key} = ?`)
                    values.push(value)
                }
            }

            // If no fields to update
            if (fields.length === 0) {
                throw new Error("No fields to update")
            }

            query += fields.join(", ")
            query += " WHERE id = ?"
            values.push(userId)

            // Execute update query
            await db.execute(query, values)

            // Get updated user
            return await this.getUserById(userId)
        } catch (error) {
            throw error
        }
    }

    // Update password
    async updatePassword(userId, currentPassword, newPassword) {
        try {
            // Get user with password
            const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [userId])

            if (users.length === 0) {
                throw new Error("User not found")
            }

            const user = users[0]

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password)

            if (!isMatch) {
                throw new Error("Current password is incorrect")
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            // Update password
            await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId])

            return { success: true }
        } catch (error) {
            throw error
        }
    }

    // Delete user
    async deleteUser(userId) {
        try {
            const [result] = await db.execute("DELETE FROM users WHERE id = ?", [userId])

            if (result.affectedRows === 0) {
                throw new Error("User not found")
            }

            return { success: true }
        } catch (error) {
            throw error
        }
    }

    // Get all doctors with filter options
    async getAllDoctors(filters = {}) {
        try {
            let query = `
        SELECT id, name, email, phone, address, profile_picture, specialization, 
        practice_years, doctor_bio, consultation_fee, available_days, available_hours, category 
        FROM users WHERE role = 'doctor'
      `

            const queryParams = []

            // Add filters if provided
            if (filters.specialization) {
                query += " AND specialization = ?"
                queryParams.push(filters.specialization)
            }

            if (filters.category) {
                query += " AND category = ?"
                queryParams.push(filters.category)
            }

            const [doctors] = await db.execute(query, queryParams)

            return doctors
        } catch (error) {
            throw error
        }
    }

    // Get doctor categories
    async getDoctorCategories() {
        try {
            const [results] = await db.execute(
                "SELECT DISTINCT category FROM users WHERE role = 'doctor' AND category IS NOT NULL",
            )
            return results.map((row) => row.category)
        } catch (error) {
            throw error
        }
    }

    // Get doctor specializations
    async getDoctorSpecializations() {
        try {
            const [results] = await db.execute(
                "SELECT DISTINCT specialization FROM users WHERE role = 'doctor' AND specialization IS NOT NULL",
            )
            return results.map((row) => row.specialization)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new UserService()

