const express = require('express');
const questionsController = require('../controllers/question.controller'); // Adjust the path as needed

const questionRouter = express.Router();

// Create a new question
questionRouter.post('/post', questionsController.create);

// Get all questions
questionRouter.get('/get', questionsController.getAll);

// Get a question by ID
questionRouter.get('/:id', questionsController.getById);

// Update a question by ID
questionRouter.put('/:id', questionsController.update);

// Delete a question by ID
questionRouter.delete('/:id', questionsController.delete);

module.exports = questionRouter;
