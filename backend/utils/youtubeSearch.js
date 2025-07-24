const axios = require('axios');
require('dotenv').config();

const youtubeSearch = async (query) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=5&type=video`;

  try {
    const response = await axios.get(url);
    return response.data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.default.url
    }));
  } catch (error) {
    console.error("YouTube API error:", error.message);
    return [];
  }
};

module.exports = youtubeSearch;
