const express = require("express");
const adminLanguageRouter = express.Router();

const {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} = require("../adminControllers/admin.language.controller");

adminLanguageRouter.get("/all", getAllLanguages);
adminLanguageRouter.get("/:id", getLanguageById);
adminLanguageRouter.post("/", createLanguage);
adminLanguageRouter.put("/:id", updateLanguage);
adminLanguageRouter.delete("/:id", deleteLanguage);

module.exports = adminLanguageRouter;
