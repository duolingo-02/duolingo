const { convertTextToSpeech } = require("../services/textToSpeechService");
const path = require("path");

const textToSpeech = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    // Convert text to speech
    const filePath = await convertTextToSpeech(text);

    // Construct the file URL
    const fileName = path.basename(filePath);
    const fileUrl = `${req.protocol}://${req.get("host")}/sounds/${fileName}`;

    res.status(200).json({ message: "Conversion successful", url: fileUrl });
  } catch (error) {
    console.error("Error converting text to speech:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { textToSpeech };
