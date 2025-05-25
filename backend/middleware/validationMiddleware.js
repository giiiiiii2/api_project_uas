const { body, validationResult } = require("express-validator")

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        })
    }
    next()
}

// User validation rules
const userValidationRules = {
    register: [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    ],
    login: [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    update: [
        body("name").optional(),
        body("email").optional().isEmail().withMessage("Valid email is required"),
        body("phone").optional(),
        body("address").optional(),
        body("date_of_birth").optional().isDate().withMessage("Valid date is required"),
        body("gender").optional().isIn(["male", "female", "other"]).withMessage("Gender must be male, female, or other"),
    ],
}

// Health record validation rules
const healthRecordValidationRules = [
    body("record_date").isDate().withMessage("Valid date is required"),
    body("symptoms").optional(),
    body("diagnosis").optional(),
    body("treatment").optional(),
    body("notes").optional(),
]

// Medication reminder validation rules
const medicationReminderValidationRules = [
    body("medication_name").notEmpty().withMessage("Medication name is required"),
    body("dosage").optional(),
    body("frequency").notEmpty().withMessage("Frequency is required"),
    body("start_date").isDate().withMessage("Valid start date is required"),
    body("end_date").optional().isDate().withMessage("Valid end date is required"),
    body("time_slots").isArray().withMessage("Time slots must be an array"),
    body("notes").optional(),
]

// Doctor consultation validation rules
const consultationValidationRules = [
    body("doctor_id").optional().isInt().withMessage("Valid doctor ID is required"),
    body("consultation_date").isDate().withMessage("Valid date is required"),
    body("consultation_time")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Valid time is required (HH:MM)"),
    body("reason").optional(),
    body("status")
        .optional()
        .isIn(["scheduled", "completed", "cancelled"])
        .withMessage("Status must be scheduled, completed, or cancelled"),
    body("notes").optional(),
]

// Favorite hospital validation rules
const favoriteHospitalValidationRules = [
    body("hospital_name").notEmpty().withMessage("Hospital name is required"),
    body("hospital_address").optional(),
    body("hospital_phone").optional(),
    body("hospital_coordinates").optional(),
]

module.exports = {
    validate,
    userValidationRules,
    healthRecordValidationRules,
    medicationReminderValidationRules,
    consultationValidationRules,
    favoriteHospitalValidationRules,
}

