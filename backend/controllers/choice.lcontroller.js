
const Choice = require('../models/choice.model');

module.exports = {
  async create(req, res) {
    try {
      const choice = await Choice.create(req.body);
      res.status(201).json(choice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  async getAll(req, res) {
    try {
      const choices = await Choice.findAll();
      res.status(200).json(choices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  async getById(req, res) {
    try {
      const choice = await Choice.findByPk(req.params.id);
      if (!choice) {
        return res.status(404).json({ message: 'Choice not found' });
      }
      res.status(200).json(choice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Choice.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        return res.status(404).json({ message: 'Choice not found' });
      }
      const updatedChoice = await Choice.findByPk(req.params.id);
      res.status(200).json(updatedChoice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Choice.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res.status(404).json({ message: 'Choice not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
