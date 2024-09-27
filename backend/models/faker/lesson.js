const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const languages = [
      { id: 1, name: "English" },
      { id: 2, name: "Français" },
      { id: 3, name: "Español" },
    ];

    // English Lessons
    const englishLessons = [
      {
        title: "Basic English Greetings",
        type: "multiple",
        question: "What is the translation of 'Bonjour'?",
        options: ["Hello", "Goodbye", "Please", "Thank you"],
        answer: "Hello",
        points: 200,
        languageId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "English Sentence Structure",
        type: "order",
        question: "Rearrange the sentence: 'I to going am school'",
        scrambledSentence: ["I", "to", "going", "am", "school"],
        correctOrder: ["I", "am", "going", "to", "school"],
        points: 150,
        languageId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Geography in English",
        type: "true_false",
        question: "Is Paris the capital of the United Kingdom?",
        isTrue: false,
        points: 100,
        languageId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // French Lessons
    const frenchLessons = [
      {
        title: "Salutations en français",
        type: "multiple",
        question: "Comment dit-on 'Goodbye' en français ?",
        options: ["Au revoir", "Merci", "Bonjour", "S'il vous plaît"],
        answer: "Au revoir",
        points: 150,
        languageId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Structure des phrases en français",
        type: "order",
        question: "Réorganisez la phrase : 'chat noir un est'",
        scrambledSentence: ["chat", "noir", "un", "est"],
        correctOrder: ["un", "chat", "noir", "est"],
        points: 200,
        languageId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Culture générale en français",
        type: "true_false",
        question: "Le Louvre est un musée à Paris.",
        isTrue: true,
        points: 100,
        languageId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Spanish Lessons
    const spanishLessons = [
      {
        title: "Saludos básicos en español",
        type: "multiple",
        question: "¿Cuál es la traducción de 'Thank you'?",
        options: ["Gracias", "Hola", "Por favor", "Adiós"],
        answer: "Gracias",
        points: 200,
        languageId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Estructura de frases en español",
        type: "order",
        question: "Reorganiza la frase: 'yo tienda la a voy'",
        scrambledSentence: ["yo", "tienda", "la", "a", "voy"],
        correctOrder: ["yo", "voy", "a", "la", "tienda"],
        points: 150,
        languageId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Cultura general en español",
        type: "true_false",
        question: "La Sagrada Familia está en Madrid.",
        isTrue: false,
        points: 100,
        languageId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Combine lessons into a single array
    const lessons = [...englishLessons, ...frenchLessons, ...spanishLessons];

    return queryInterface.bulkCreate(lessons);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.truncate();
  },
};
