const cheerio = require("cheerio");
const axios = require("axios");
const { Agent } = require("https");
const { BASE_URL } = require("../const/index");

const agent = new Agent({ rejectUnauthorized: false });

const scrapeSite = async (endpoint) => {
    try {
        console.log(`Fetching from: ${BASE_URL}${endpoint}`);
        const fetchSite = await axios.get(`${BASE_URL}${endpoint}`, {
            httpsAgent: agent,
        });
        const html = await fetchSite.data;
        const status = fetchSite.status;
        const $ = cheerio.load(html);
        return { $, status };
    } catch (e) {
        console.error(`Error in scrapeSite for endpoint ${endpoint}:`, e.message);
        return Promise.reject(e);
    }
};

module.exports = { scrapeSite };
