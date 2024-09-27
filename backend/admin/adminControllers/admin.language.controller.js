const Language = require("../../models/language.model");

module.exports = {
  getAllLanguages: async (req, res) => {
    try {
      const languages = await Language.findAll();
      res.status(200).json(languages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLanguageById: async (req, res) => {
    try {
      const language = await Language.findByPk(req.params.id);
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
      res.status(200).json(language);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createLanguage: async (req, res) => {
    try {
      const newLanguage = await Language.create(req.body);
      res.status(201).json(newLanguage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateLanguage: async (req, res) => {
    try {
      const [updated] = await Language.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        return res.status(404).json({ message: "Language not found" });
      }
      const updatedLanguage = await Language.findByPk(req.params.id);
      res.status(200).json(updatedLanguage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteLanguage: async (req, res) => {
    try {
      const deleted = await Language.destroy({ where: { id: req.params.id } });
      if (!deleted) {
        return res.status(404).json({ message: "Language not found" });
      }
      res.status(200).json({ message: "Language deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
