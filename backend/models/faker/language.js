const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const languages = [
      {
        name: "English",
        description: "English language",
        languagePicture:
          "https://cdn.countryflags.com/thumbs/united-kingdom/flag-square-500.png", // Génération d'une image avec faker
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Français", // Ajout du français
        description: "French language",
        languagePicture:
          "https://cdn.countryflags.com/thumbs/france/flag-square-500.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Spanish", // Ajout de l'espagnol
        description: "Spanish language",
        languagePicture:
          "https://cdn.countryflags.com/thumbs/spain/flag-square-500.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log("Languages to be seeded:", languages);

    try {
      return await queryInterface.bulkCreate(languages); // Spécifier la table 'Languages'
    } catch (error) {
      console.error("Error during bulkInsert:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      return await queryInterface.truncate(); // Supprime toutes les entrées de la table 'Languages'
    } catch (error) {
      console.error("Error during bulkDelete:", error);
    }
  },
};
