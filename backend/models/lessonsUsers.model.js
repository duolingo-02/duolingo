const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const LessonsUsers = sequelize.define("LessonsUsers", {
  progress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "User",
      key: "id",
    },
  },
  lessonId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Lesson",
      key: "id",
    },
  },
});

module.exports = LessonsUsers;
