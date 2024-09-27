const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const LanguageUsers = sequelize.define("LanguageUsers", {});

module.exports = LanguageUsers;
