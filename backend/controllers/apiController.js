const axios = require('axios');

exports.searchGoogle = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}`
    );
    res.json(response.data.items);
  } catch (err) {
    res.status(500).json({ message: 'Google search error' });
  }
};

exports.searchYouTube = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${process.env.YOUTUBE_API_KEY}&maxResults=5`
    );
    res.json(response.data.items);
  } catch (err) {
    res.status(500).json({ message: 'YouTube search error' });
  }
};
