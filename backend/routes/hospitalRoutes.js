const express = require("express");
const router = express.Router();

const { getProvinces } = require("../scrape/get-provinces");
const { getCities } = require("../scrape/get-cities");
const { getHospitalList } = require("../scrape/hospitals");
const { getBedDetail } = require("../scrape/bed-detail");
const { getHospitalMap } = require("../scrape/hospital-map");

// semua endpoint GET
router.get("/get-provinces", async (req, res) => {
    const data = await getProvinces();
    res.json(data);
});

router.get("/get-cities", async (req, res) => {
    const { provinceid } = req.query;
    const data = await getCities(provinceid);
    res.json(data);
});

router.get("/get-hospitals", async (req, res) => {
    const { type, provinceid, cityid } = req.query;
    const data = await getHospitalList({
        type: Number(type),
        provinceid,
        cityid,
    });
    res.json(data);
});

router.get("/get-bed-detail", async (req, res) => {
    const { type, hospitalid } = req.query;
    const data = await getBedDetail(hospitalid, Number(type));
    res.json(data);
});

router.get("/get-hospital-map", async (req, res) => {
    const { hospitalid } = req.query;
    const data = await getHospitalMap(hospitalid);
    res.json(data);
});

module.exports = router;
