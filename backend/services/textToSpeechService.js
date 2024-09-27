const gTTS = require("gtts");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const convertTextToSpeech = (text) => {
  return new Promise((resolve, reject) => {
    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(__dirname, "../sounds", fileName);

    const gtts = new gTTS(text, "en");

    gtts.save(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
};

module.exports = { convertTextToSpeech };
