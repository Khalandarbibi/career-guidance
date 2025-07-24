const express = require("express");
const router = express.Router();
const { searchGoogle, searchYouTube } = require("../controllers/apiController");

router.get("/google", searchGoogle);
router.get("/youtube", searchYouTube);

module.exports = router;
