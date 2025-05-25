const { verifyToken } = require("../config/auth")

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            })
        }

        // Verify token
        const token = authHeader.split(" ")[1]
        const decoded = verifyToken(token)

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
            })
        }

        // Add user info to request
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed.",
            error: error.message,
        })
    }
}

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required.",
        })
    }
}

// Middleware to check if user is doctor
const isDoctor = (req, res, next) => {
    if (req.user && (req.user.role === "doctor" || req.user.role === "admin")) {
        next()
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied. Doctor privileges required.",
        })
    }
}

// Middleware to check if user is accessing their own data or is admin
const isOwnerOrAdmin = (req, res, next) => {
    const resourceUserId = Number.parseInt(req.params.userId || req.params.id)

    if (req.user && (req.user.id === resourceUserId || req.user.role === "admin")) {
        next()
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied. You can only access your own data.",
        })
    }
}

module.exports = {
    authenticate,
    isAdmin,
    isDoctor,
    isOwnerOrAdmin,
}

