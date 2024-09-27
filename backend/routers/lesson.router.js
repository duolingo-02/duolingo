const express = require("express");
const lessonController = require("../controllers/lesson.controller");

const router = express.Router();

// Get all lessons by language ID
router.get("/language/:languageId", lessonController.getLessonsByLanguageId);

// Get a specific lesson by ID and language ID
router.get(
  "/:lessonId/language/:languageId",
  lessonController.getLessonByIdAndLanguageId
);

// Get the next lesson for the user (user progression)
router.get(
  "/next/:userId/language/:languageId",
  lessonController.getNextLesson
);
// Route pour récupérer la progression de l'utilisateur dans une langue
router.get(
  "/user/:userId/language/:languageId/progress",
  lessonController.getUserProgressInLanguage
);

router.get(
  "/:lessonId/stages/count",
  lessonController.getLessonsCountByLanguageId
);

// // Check if all stages are completed for a user in a language
// router.get("/user/:userId/language/:languageId/stages/completed", lessonController.checkAllStagesCompleted);

module.exports = router;
