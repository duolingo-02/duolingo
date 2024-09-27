const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Choice = sequelize.define('Choice', {
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  questionId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Questions',
      key: 'id'
    }
  }
});

module.exports = Choice;