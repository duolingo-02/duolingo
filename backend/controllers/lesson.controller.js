const { LessonsUsers, Language, Lesson } = require("../models/index");
module.exports = {
  // Get all lessons by language ID
  async getLessonsByLanguageId(req, res) {
    try {
      const { languageId } = req.params;
      const lessons = await Lesson.findAll({
        where: { languageId },
      });
      if (!lessons || lessons.length === 0) {
        return res
          .status(404)
          .json({ message: "No lessons found for this language." });
      }
      res.status(200).json(lessons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a lesson by ID and languageId (useful if verifying language context is needed)
  async getLessonByIdAndLanguageId(req, res) {
    try {
      const { lessonId, languageId } = req.params;
      const lesson = await Lesson.findOne({
        where: { id: lessonId, languageId },
      });
      if (!lesson) {
        return res
          .status(404)
          .json({ message: "Lesson not found for this language." });
      }
      res.status(200).json(lesson);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Get the next lesson for the user (useful for progression-based unlocking of lessons)
  async getNextLesson(req, res) {
    try {
      const { languageId, userId } = req.params;

      // Assuming UserProgress tracks completed lessons and lessonId is stored
      const lastCompletedLesson = await UserProgress.findOne({
        where: { userId, languageId },
      });

      const nextLesson = await Lesson.findOne({
        where: {
          languageId,
          id: {
            [Op.gt]: lastCompletedLesson ? lastCompletedLesson.lessonId : 0,
          },
        },
      });

      if (!nextLesson) {
        return res.status(404).json({ message: "No more lessons available." });
      }

      res.status(200).json(nextLesson);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getUserProgressInLanguage(req, res) {
    const { userId, languageId } = req.params;

    try {
      // Chercher la progression de l'utilisateur dans la langue
      const lessonsProgress = await LessonsUsers.findAll({
        where: { userId },
        include: [
          {
            model: Lesson,

            include: [Language],
          },
        ],
      });

      // Si aucune progression n'est trouvée
      if (lessonsProgress.length === 0) {
        // Récupérer la première leçon de la langue
        const firstLesson = await Lesson.findOne({
          where: { languageId },
        });

        if (firstLesson) {
          // Créer une nouvelle progression pour la première leçon
          const newProgress = await LessonsUsers.create({
            userId,
            lessonId: firstLesson.id,
            isCompleted: false,
            isActive: true,
            progress: 0, // Débuter à 0%
          });

          // Retourner la nouvelle progression avec la première leçon
          return res.status(200).json([newProgress]);
        } else {
          // Si aucune leçon n'est trouvée pour cette langue
          return res.status(404).json({
            message: "Aucune leçon trouvée pour cette langue.",
          });
        }
      }

      // Si des progressions existent, les retourner
      res.status(200).json(lessonsProgress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLessonsCountByLanguageId(req, res) {
    try {
      const { languageId } = req.params;

      // Count the number of lessons with the given languageId
      const count = await Lesson.count({
        where: { languageId },
      });

      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
