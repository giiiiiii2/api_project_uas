const axios = require("axios");
const https = require("https");
const { BASE_URL } = require("../const/index");

const agent = new https.Agent({ rejectUnauthorized: false });

const getCities = async (provinceId) => {
    const { data } = await axios.get(
        `${BASE_URL}Kabkota?kode_propinsi=${provinceId}`,
        {
            httpsAgent: agent,
        }
    );
    return Promise.resolve({
        cities: data.data.map((data) => ({
            id: data.kode_kabkota,
            name: data.nama_kabkota,
        })),
    });
};

module.exports = { getCities };
