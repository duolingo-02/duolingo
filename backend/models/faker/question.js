const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
      const questions = [];
  
      for (let i = 0; i < 50; i++) {
        questions.push({
          questionText: faker.lorem.sentence(),
          lessonId:  faker.number.int({ min: 1, max: 20 }),
          type: faker.helpers.arrayElement(['multiple-choice', 'ordering']),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
  
      return queryInterface.bulkCreate( questions);
    },
  
    down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Questions', null, {});
    }
  };
  