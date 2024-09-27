// ==============================
// Standard Type Definitions
// ==============================

/**
 * Standard type for IDs (usually a number or string).
 */
export type ID = number | string;

/**
 * Type representing a generic function signature.
 * T is the argument type, R is the return type.
 */
export type Func<T = void, R = void> = (arg: T) => R;

/**
 * Standard type for timestamp values.
 * Typically, a string formatted as ISO or number for milliseconds.
 */
export type Timestamp = string | number;

/**
 * Standard type for a nullable value.
 */
export type Nullable<T> = T | null;

/**
 * A common definition for an object with key-value pairs where keys are strings.
 */
export interface Dictionary<T> {
  [key: string]: T;
}

// ==============================
// Component Props Definitions
// ==============================

/**
 * Generic children prop.
 * Often used for wrapping child elements in components.
 */
export interface ChildrenProps {
  children?: React.ReactNode;
}

/**
 * Standard props for components that can be disabled.
 */
export interface DisableableProps {
  disabled?: boolean;
}

/**
 * Props definition for components that require a unique identifier.
 */
export interface IdentifiableProps {
  id: ID;
}

/**
 * Props for components that need a title.
 */
export interface TitleProps {
  title: string;
}

/**
 * Props for components handling authentication state.
 */
export interface AuthProps {
  isAuthenticated: boolean;
  onLogin: Func<void, void>; // Function to handle login action
  onLogout: Func<void, void>; // Function to handle logout action
}

/**
 * Props for components with loading state and error handling.
 */
export interface LoadingProps {
  loading: boolean;
  error?: string; // Optional error message
}

// ==============================
// Form Input Types
// ==============================

/**
 * Props for form input fields (text, number, etc.).
 */
export interface InputFieldProps {
  value: string | number;
  onChange: Func<string | number, void>; // Handler for change events
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Props for select dropdown fields.
 */
export interface SelectFieldProps {
  options: Array<{ label: string; value: string | number }>;
  value: string | number;
  onChange: Func<string | number, void>;
  disabled?: boolean;
}

// ==============================
// API Response Types
// ==============================

/**
 * Standard response structure for API calls.
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

/**
 * Standard response when dealing with lists of data.
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
