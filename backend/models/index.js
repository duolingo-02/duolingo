const Sequelize = require("sequelize");
const sequelize = require("../config/config");

const User = require("./user.model");
const Lesson = require("./lesson.model");
const Language = require("./language.model");
const Achievement = require("./achievement.model");
const UserAchievement = require("./userAchievement.model");
const Progress = require("./progress.model");
const Question = require("./question.model");
const Choice = require("./choice.model");
const LessonsUsers = require("./lessonsUsers.model");
const LanguageUsers = require("./languageUsers.model");

User.belongsToMany(Lesson, { foreignKey: "userId", through: LessonsUsers });
Lesson.belongsToMany(User, { foreignKey: "lessonId", through: LessonsUsers });

User.belongsToMany(Language, { foreignKey: "userId", through: LanguageUsers });
Language.belongsToMany(User, {
  foreignKey: "lessonId",
  through: LanguageUsers,
});

//  associations
User.hasMany(Progress, { foreignKey: "userId" });
Progress.belongsTo(User, { foreignKey: "userId" });

UserAchievement.belongsTo(User, { foreignKey: "userId" });
User.hasMany(UserAchievement, { foreignKey: "userId" });

Lesson.belongsTo(Language, { foreignKey: "languageId" });
Language.hasMany(Lesson, { foreignKey: "languageId" });

UserAchievement.belongsTo(Achievement, { foreignKey: "achievementId" });
Achievement.hasMany(UserAchievement, { foreignKey: "achievementId" });

Progress.belongsTo(Lesson, { foreignKey: "lessonId" });
Lesson.hasMany(Progress, { foreignKey: "lessonId" });

Question.belongsTo(Lesson, { foreignKey: "lessonId" });
Lesson.hasMany(Question, { foreignKey: "lessonId" });

Question.hasMany(Choice, { foreignKey: "questionId" });
Choice.belongsTo(Question, { foreignKey: "questionId" });

User.hasMany(LessonsUsers, { foreignKey: "userId" });
LessonsUsers.belongsTo(User, { foreignKey: "userId" });

Lesson.hasMany(LessonsUsers, { foreignKey: "lessonId" });
LessonsUsers.belongsTo(Lesson, { foreignKey: "lessonId" });

// sequelize.drop().then(() => {
//   console.log("All models were synchronized successfully.");
// });

// sequelize
//   .sync({ force: false, alter: true })
//   .then(() => {
//     console.log("All models were synchronized successfully.");
//   })
//   .catch((error) => {
//     console.error("Error synchronizing models:", error);
//   });

// const userFaker = require("./faker/users").up(User, sequelize);
// const languageFaker = require("./faker/language").up(Language, sequelize);
// const lessonFaker = require("./faker/lesson").up(Lesson, sequelize);
// const questionFaker = require("./faker/question").up(Question, sequelize);

// const achievementFaker = require("./faker/acheivement").up(
//   Achievement,
//   sequelize
// );

module.exports = {
  User,
  Lesson,
  Language,
  Achievement,
  UserAchievement,
  LessonsUsers,
  Progress,
  Question,
  Choice,
  sequelize,
};
