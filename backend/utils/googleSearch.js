const axios = require('axios');
require('dotenv').config();

const googleSearch = async (query) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

  try {
    const response = await axios.get(url);
    return response.data.items || [];
  } catch (error) {
    console.error("Google Search API error:", error.message);
    return [];
  }
};

module.exports = googleSearch;
