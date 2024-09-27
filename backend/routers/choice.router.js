const express = require('express');
const choiceController = require('../controllers/choice.controller'); 

const choiceRouter = express.Router();


choiceRouter.post('/post', choiceController.create); 
choiceRouter.get('/get', choiceController.getAll);   
choiceRouter.get('/:id', choiceController.getById);   
choiceRouter.put('/:id', choiceController.update);      
choiceRouter.delete('/:id', choiceController.delete);   

module.exports = choiceRouter;
