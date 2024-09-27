// ==============================
// TypeScript Interface Definitions
// ==============================

/**
 * Props for the ProtectedRoute component.
 * Determines access based on authentication and authorization.
 */
export interface ProtectedRouteProps {
  children: React.ReactNode; // Child components to be rendered if access is granted
  isProtected?: boolean; // Indicates if the route requires user authentication
  forAdmin?: boolean; // Indicates if the route is restricted to admin users
}

/**
 * Props for the NavbarWrapper component.
 * Wraps child components with the navigation bar.
 */
export interface NavbarWrapperProps {
  children: React.ReactNode; // Child components to be wrapped with Navbar
}

/**
 * Props for the GameWrapper component.
 * Wraps game-related components with the GameBar.
 */
export interface GameWrapperProps {
  children: React.ReactNode;  // Ensure you have children defined
  initialTimerValue: number;   // Add this line
}
/**
 * Props for the StageListWrapper component.
 * Includes the languageId to filter stages based on language.
 */
export interface StageListWrapperProps {
  languageId: number; // Identifier for the selected language
}

/**
 * Props for the MultipleChoiceQuiz component.
 * Expects an array of questions to render the quiz.
 */
export interface MultipleChoiceQuizProps {
  questions: Question[]; // An array of questions required for the quiz
}

/**
 *  Props of a single question in the MultipleChoiceQuiz.
 */
export interface Question {
  id: number; // Unique identifier for the question
  questionText: string; // Text content of the question
  options: string[]; // Array of possible answer options
  correctAnswer: string; // The correct answer from the options
}

/**
 * Props for the Navbar component.
 * Controls authentication and logout functionality.
 */
export interface NavbarProps {
  isAuthenticated: boolean;
  logout: () => void;
}

// Type definition for NavbarWrapper component props
export interface NavbarWrapperProps {
  children: React.ReactNode; // Nested content (children components)
}

export interface Language {
  id: number;
  name: string;
  description?: string;
  languagePicture: string;
}

export interface AuthState {
  token: string | null;
  userId: number | null;
  loading: boolean;
  error: string | null;
}
