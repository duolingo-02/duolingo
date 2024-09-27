
const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
      const choices = [];
  
      for (let i = 0; i < 50; i++) {
        choices.push({
          text: faker.lorem.words(3),
          isCorrect: faker.datatype.boolean(),
          questionId: faker.number.int({ min: 1, max: 50 }), // Adjust based on the number of questions
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
  
      return queryInterface.bulkCreate( choices);
    },
  
    down: async (queryInterface, Sequelize) => {
      return queryInterface.truncate();
    }
  };
  