const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];

    // Ajout des utilisateurs spécifiques testUser, testAdmin, testTeacher
    users.push(
      {
        username: "testUser",
        email: "testUser@email.com",
        passwordHash: await bcrypt.hash("1234", 10),
        profilePicture: faker.image.avatar(),
        totalPoints: faker.number.int({ min: 0, max: 15000 }),
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "testAdmin",
        email: "testAdmin@email.com",
        passwordHash: await bcrypt.hash("1234", 10),
        profilePicture: faker.image.avatar(),
        totalPoints: faker.number.int({ min: 0, max: 1500 }),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "testTeacher",
        email: "testTeacher@email.com",
        passwordHash: await bcrypt.hash("1234", 10),
        profilePicture: faker.image.avatar(),
        totalPoints: faker.number.int({ min: 0, max: 1500 }),
        role: "teacher",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    // Générer les autres utilisateurs aléatoires
    for (let i = 0; i < 17; i++) {
      users.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        passwordHash: await bcrypt.hash("1234", 10),
        profilePicture: faker.image.avatar(),
        totalPoints: faker.number.int({ min: 0, max: 1500 }),
        role: faker.helpers.arrayElement(["user", "admin", "teacher"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Utilisation de bulkCreate pour insérer les utilisateurs
    return queryInterface.bulkCreate(users);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.truncate();
  },
};
