const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
require("./config/config");
require("./models");
const morgan = require("morgan");
const userRouter = require("./routers/user.router");
const languageRouter = require("./routers/language.router");
const lessonsRouter = require("./routers/lesson.router");
const questionRouter = require("./routers/question.router");
const choiceRouter = require("./routers/question.router");
const lessonsUserRouter = require("./routers/lessonUsers.router.js");
const textToSpeechRoutes = require("./routers/textToSpeechRoutes.js");

const app = express();
const port = process.env.PORT || 3000;
const { apiMessageHandler } = require("./middleware");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(apiMessageHandler);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Admin Routes
const adminUserRouter = require("./admin/adminRouters/admin.user.router");
const adminLanguageRouter = require("./admin/adminRouters/admin.language.router");

// Create the sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, "sounds");
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir);
}
// Serve static files from the sounds directory
app.use("/sounds", express.static(soundsDir));

app.use("/api/admin/user", adminUserRouter);
app.use("/api/admin/languages", adminLanguageRouter);

app.use("/api/user", userRouter);
app.use("/api/language", languageRouter);
app.use("/api/lessons", lessonsRouter);
app.use("/api/question", questionRouter);
app.use("/api/choices", choiceRouter);
app.use("/api/lessonsUsers", lessonsUserRouter);
app.use("/api", textToSpeechRoutes);
app.post("/api/lessonsUsers/post", (req, res) => {
  const { userId, lessonId, isActive, progress, isCompleted } = req.body;

  // Validate the request data
  if (
    !userId ||
    !lessonId ||
    typeof isActive !== "boolean" ||
    typeof progress !== "number" ||
    typeof isCompleted !== "boolean"
  ) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  // Process the request
  // ...

  res.status(200).json({ message: "Data posted successfully" });
});
app.use("/api/sound", textToSpeechRoutes);
app.listen(port, () => {
  console.log(`Server running on port  http://localhost:${port}`);
});
