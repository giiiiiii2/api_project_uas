const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const healthRecordRoutes = require("./routes/healthRecordRoutes");
const medicationReminderRoutes = require("./routes/medicationReminderRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const doctorConsultationRoutes = require("./routes/doctorConsultationRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// API Routes
app.get("/api/get-provinces", async (req, res) => {
    try {
        const provinces = await getProvinces();
        res.json(provinces);
    } catch (error) {
        console.error("Error fetching provinces:", error);
        res.status(500).json({ error: "Failed to fetch provinces" });
    }
});

app.get("/api/get-cities", async (req, res) => {
    try {
        const provinceId = req.query.provinceid;
        if (!provinceId) {
            return res.status(400).json({ error: "Province ID is required" });
        }

        const cities = await getCities(provinceId);
        res.json(cities);
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ error: "Failed to fetch cities" });
    }
});

app.get("/api/get-hospitals", async (req, res) => {
    try {
        const provinceId = req.query.provinceid;
        const cityId = req.query.cityid;

        if (!provinceId || !cityId) {
            return res
                .status(400)
                .json({ error: "Province ID and City ID are required" });
        }

        const hospitals = await getHospitals(provinceId, cityId);
        res.json(hospitals);
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        res.status(500).json({ error: "Failed to fetch hospitals" });
    }
});

app.get("/api/get-bed-detail", async (req, res) => {
    try {
        const hospitalId = req.query.hospitalid;

        if (!hospitalId) {
            return res.status(400).json({ error: "Hospital ID is required" });
        }

        const bedDetail = await getBedDetail(hospitalId);
        res.json(bedDetail);
    } catch (error) {
        console.error("Error fetching bed details:", error);
        res.status(500).json({ error: "Failed to fetch bed details" });
    }
});

app.get("/api/get-hospital-map", async (req, res) => {
    try {
        const hospitalId = req.query.hospitalid;

        if (!hospitalId) {
            return res.status(400).json({ error: "Hospital ID is required" });
        }

        const hospitalMap = await getHospitalMap(hospitalId);
        res.json(hospitalMap);
    } catch (error) {
        console.error("Error fetching hospital map:", error);
        res.status(500).json({ error: "Failed to fetch hospital map" });
    }
});
// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/health-records", healthRecordRoutes);
app.use("/api/medication-reminders", medicationReminderRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/consultations", doctorConsultationRoutes);

// Root route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to MediTrack API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

module.exports = app;
