const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM,
    values: ["user", "admin", "teacher"],
    allowNull: false,
    defaultValue: "user",
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "https://cdn-icons-png.flaticon.com/512/4775/4775505.png",
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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

module.exports = User;
