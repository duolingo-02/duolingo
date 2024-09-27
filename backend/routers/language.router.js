const express = require("express");
const languageRouter = express.Router();


const {
    getALllLanguage
   
  } = require("../controllers/language.controller");
  
 
  languageRouter.get("/get",getALllLanguage);
 
  
  module.exports =languageRouter;