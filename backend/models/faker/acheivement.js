const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
      const achievements = [];
  
      for (let i = 0; i < 10; i++) {
        achievements.push({
          title: faker.lorem.words(2),
          description: faker.lorem.sentence(),
          points: faker.number.int({ min: 10, max: 100 }),
          picture: faker.image.url(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
  
      return queryInterface.bulkCreate(achievements);
    },
  
    down: async (queryInterface, Sequelize) => {
      return queryInterface.truncate();
    }
  };
  