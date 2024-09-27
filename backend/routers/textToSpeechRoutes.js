const express = require("express");
const { textToSpeech } = require("../controllers/textToSpeechController");

const router = express.Router();

// Define the text-to-speech route
router.post("/text-to-speech", textToSpeech);

module.exports = router;
