const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Progress = sequelize.define("Progress", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
  },
  lessonId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Lessons",
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("completed", "in-progress"),
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // points: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   defaultValue: 0,
  // },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Progress;
