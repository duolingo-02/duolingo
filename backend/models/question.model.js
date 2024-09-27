const { DataTypes } = require('sequelize');
const sequelize = require('../config/config')

const Question = sequelize.define('Question', {
  questionText: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lessonId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Lessons',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM,
    values: ['multiple-choice', 'ordering'], 
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});


module.exports = Question;