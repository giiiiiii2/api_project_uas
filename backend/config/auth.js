const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "meditrack_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN,

    generateToken: (userId, role) => {
        return jwt.sign({ id: userId, role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    },
};
