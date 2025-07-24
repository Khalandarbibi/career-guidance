import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/data", apiRoutes);
app.get("/", (req, res) => {
  res.json({
    moksirh: "done",
  });
});

dotenv.config();

app.post("/api/data", async (req, res) => {
  const { education, stream, interest, skill } = req.body;

  if (!education || !stream || !interest || !skill) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  function cleanJSONResponse(text) {
    text = text.trim();

    if (text.startsWith("```json")) {
      text = text
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.substring(jsonStart, jsonEnd + 1);
    }

    return text;
  }

  // 🔍 Get the top relevant YouTube video using Google API
  async function fetchYouTubeVideo(query) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const encodedQuery = encodeURIComponent(query);

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodedQuery}&type=video&order=relevance&key=${apiKey}`;

    const response = await axios.get(url);
    const video = response.data.items[0];

    return {
      title: video.snippet.title,
      videoId: video.id.videoId,
      thumbnail: video.snippet.thumbnails.high.url,
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are an intelligent assistant helping users discover real-world learning and career resources.
    
    Given the following user profile:
    
    - Education Level: ${education}
    - Stream: ${stream}
    - Interests: ${interest}
    - Skills: ${skill}
    
    🔍 Search the internet to gather the most relevant, up-to-date, and trustworthy data for the user.
    
    🎯 Your output must include only this **strictly valid JSON** structure:
    
    {
      "courses": [
        {
          "title": "Course Title",
          "platform": "Coursera / Udemy / edX / etc.",
          "description": "Brief overview of the course",
          "link": "Direct URL to the course"
        },
        ...
      ],
      "resources": [
        {
          "title": "Resource Title",
          "description": "Short summary of what the resource offers",
          "link": "Direct URL to the resource"
        },
        ...
      ],
      "internships": [
        {
          "title": "Internship Title",
          "company": "Company Name",
          "description": "Short summary of what the internship involves",
          "link": "Direct URL to the internship listing or careers page"
        },
        ...
      ]
    }
    
    ✅ Include a mix of **free and paid** courses (if available), but always prioritize quality and credibility.
    ✅ Only include **real** courses, internships, and resources with valid and working **direct links**.
    ❌ Do NOT include YouTube videos, vague summaries, placeholders, or any additional commentary outside the JSON.
    
    Return only the JSON.
    `;

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();
    const cleanedResponse = cleanJSONResponse(rawResponse);
    const parsed = JSON.parse(cleanedResponse);

    // 🔗 Fetch video using YouTube API
    const videoQuery = `${interest} ${skill} tutorial`;
    const video = await fetchYouTubeVideo(videoQuery);
    console.log(parsed);
    return res.json({
      ...parsed,
      videos: [video],
    });
  } catch (err) {
    console.error("Error processing request:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect("mongodb://localhost:27017/mini_final", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected"); // ✅ Add this line
    app.listen(3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));
