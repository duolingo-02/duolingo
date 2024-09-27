const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Lesson = sequelize.define("Lesson", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("multiple", "order", "true_false"),
    allowNull: false,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON, // For multiple-choice options
    allowNull: true, // Only for "multiple" type
  },
  answer: {
    type: DataTypes.STRING, // For multiple-choice correct answer
    allowNull: true, // Only for "multiple" type
  },
  scrambledSentence: {
    type: DataTypes.JSON, // For sentence order type
    allowNull: true, // Only for "order" type
  },
  correctOrder: {
    type: DataTypes.JSON, // For sentence order type
    allowNull: true, // Only for "order" type
  },
  isTrue: {
    type: DataTypes.BOOLEAN, // For true/false type
    allowNull: true, // Only for "true_false" type
  },
  points: {
    type: DataTypes.INTEGER, // Points for the lesson
    allowNull: false,
  },
  languageId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Languages",
      key: "id",
    },
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Lesson;
