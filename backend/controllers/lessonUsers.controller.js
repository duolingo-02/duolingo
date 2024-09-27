const LessonsUsers = require("../models/lessonsUsers.model");
const Lesson = require("../models/lesson.model");
const User = require("../models/user.model");

module.exports = {
  // Create new
  async create(req, res) {
    console.log("Received POST data: ", req.body);
    try {
      const lessonsUsers = await LessonsUsers.create(req.body);
      console.log("Created entry: ", lessonsUsers);
      res.status(201).json(lessonsUsers);
    } catch (error) {
      console.error("Error creating LessonsUsers entry:", error);
      res.status(400).json({ error: error.message });
    }
  },

  // getALL with relations User and Lessoin
  getAll: async (req, res) => {
    try {
      const lessonsUsers = await LessonsUsers.findAll({
        include: [{ model: User }, { model: Lesson }],
      });
      res.status(200).json(lessonsUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get on by ID
  getById: async (req, res) => {
    try {
      const lessonsUser = await LessonsUsers.findByPk(req.params.id, {
        include: [{ model: User }, { model: Lesson }],
      });
      if (!lessonsUser) {
        return res
          .status(404)
          .json({ message: "LessonsUsers entry not found" });
      }
      res.status(200).json(lessonsUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update  exsitant one
  update: async (req, res) => {
    try {
      const [updated] = await LessonsUsers.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        return res
          .status(404)
          .json({ message: "LessonsUsers entry not found" });
      }
      const updatedLessonsUser = await LessonsUsers.findByPk(req.params.id, {
        include: [{ model: User }, { model: Lesson }],
      });
      res.status(200).json(updatedLessonsUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete one by ID
  delete: async (req, res) => {
    try {
      const deleted = await LessonsUsers.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res
          .status(404)
          .json({ message: "LessonsUsers entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Compter les leçons terminées et non terminées
  countByIsCompleted: async (req, res) => {
    // console.log("ok");
    try {
      const isCompleted = req.query.isCompleted === "true";
      const count = await LessonsUsers.count({
        where: { isCompleted },
      });
      res.status(200).json({ count, isCompleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Récupérer toutes les leçons d'un utilisateur spécifique
  getLessonsByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const lessonsUsers = await LessonsUsers.findAll({
        where: { userId }, // Filtrer par userId
        include: [{ model: Lesson }], // Inclure les leçons associées
      });
      if (lessonsUsers.length === 0) {
        return res
          .status(404)
          .json({ message: "No lessons found for this user" });
      }
      res.status(200).json(lessonsUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer le nombre de leçons actives et terminées pour un utilisateur

  getActiveAndCompletedLessonsCount: async (req, res) => {
    try {
      const userId = req.params.userId;

      // Compter les leçons actives
      const activeCount = await LessonsUsers.count({
        where: { userId, isActive: true },
      });

      // Compter les leçons terminées
      const completedCount = await LessonsUsers.count({
        where: { userId, isCompleted: true },
      });

      res.status(200).json({
        activeLessons: activeCount,
        completedLessons: completedCount,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getUserProgressInLanguage(req, res) {
    console.log("ok");
    const { userId, languageId } = req.params;

    try {
      // Trouver toutes les leçons liées à la langue et à l'utilisateur
      const lessonsProgress = await LessonsUsers.findAll({
        where: { userId },
        include: [
          {
            model: Lesson,
            where: { languageId }, // Filtrer par langue
            include: [Language], // Inclure les informations de la langue
          },
        ],
      });

      if (lessonsProgress.length === 0) {
        return res
          .status(404)
          .json({ message: "No progress found for this language." });
      }

      res.status(200).json(lessonsProgress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: error.message });
    }
  },
  async getUserProgressInLanguage(req, res) {
    console.log("ok");
    const { userId, languageId } = req.params;

    try {
      // Trouver toutes les leçons liées à la langue et à l'utilisateur
      const lessonsProgress = await LessonsUsers.findAll({
        where: { userId },
        include: [
          {
            model: Lesson,
            where: { languageId }, // Filtrer par langue
            include: [Language], // Inclure les informations de la langue
          },
        ],
      });

      if (lessonsProgress.length === 0) {
        return res
          .status(404)
          .json({ message: "No progress found for this language." });
      }

      res.status(200).json(lessonsProgress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: error.message });
    }
  },

  async countPointsByUserId(req, res) {
    const { userId } = req.params;

    try {
      const totalPoints = await LessonsUsers.sum("progress", {
        where: { userId },
      });

      res.status(200).json({ totalPoints });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors du calcul des points", error });
    }
  },
};
