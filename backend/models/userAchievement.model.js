const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 

const UserAchievement = sequelize.define('UserAchievement', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  achievementId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Achievements', 
      key: 'id'
    }
  },
  achievedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
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

module.exports = UserAchievement;