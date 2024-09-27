const Question  = require('../models/question.model');

module.exports = {

 create :   async(req, res)=>  {
    try {
      const question = await Question.create(req.body);
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },


 getAll :   async(req, res) =>{
    try {
      const questions = await Question.findAll();
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

getById :   async  (req, res)=> {
    try {
      const question = await Question.findByPk(req.params.id);
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


 update :async (req, res) => {
    try {
      const [updated] = await Question.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        return res.status(404).json({ message: 'Question not found' });
      }
      const updatedQuestion = await Question.findByPk(req.params.id);
      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },


 delete :   async(req, res) => {
    try {
      const deleted = await Question.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res.status(404).json({ message: 'Question not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

