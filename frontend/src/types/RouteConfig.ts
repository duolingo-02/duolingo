// ==============================
// TypeScript Interface Definitions
// ==============================

/**
 * Interface for a single question in the MultipleChoiceQuiz component.
 */
export interface Question {
  id: number; // Unique identifier for the question
  question: string; // Text content of the question
  options: string[]; // Array of possible answer options
  correctAnswer: string; // The correct answer from the options
}

/**
 * Props for the MultipleChoiceQuiz component.
 * Expects an array of questions to render the quiz.
 */
export interface MultipleChoiceQuizProps {
  questions: Question[]; // An array of Question objects required for the quiz
}

/**
 * Props for the StageListWrapper component.
 * Includes the languageId to filter stages based on language.
 */
export interface StageListWrapperProps {
  languageId: number; // Identifier for the selected language
}

/**
 * Interface for route configuration used in routing setup.
 */
export interface RouteConfig {
  path: string; // URL path for the route
  component: React.ReactNode; // React component to render for the route
  isProtected: boolean; // Indicates if the route requires user authentication
  forAdmin?: boolean; // (Optional) Indicates if the route is restricted to admin users
  withNavbar: boolean; // Indicates if the route should include the navigation bar
  useGameLayout?: boolean; // (Optional) Indicates if the route should use the game-specific layout
}
