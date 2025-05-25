const axios = require("axios");
const { Agent } = require("https");
const { BASE_URL } = require("../const/index");

const agent = new Agent({ rejectUnauthorized: false });

const getHospitalMap = async (hospitalid) => {
    const data = await axios.get(`${BASE_URL}rumah_sakit/${hospitalid}`, {
        httpsAgent: agent,
    });
    return {
        status: data.status,
        data: {
            id: hospitalid,
            name: data.data.data.RUMAH_SAKIT,
            address: data.data.data.ALAMAT,
            lat: data.data.data.alt,
            long: data.data.data.long,
            gmaps: `https://www.google.com/maps/search/?api=1&query=${data.data.data.alt},${data.data.data.long}`,
        },
    };
};

module.exports = { getHospitalMap };
