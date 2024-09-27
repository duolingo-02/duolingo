// ==============================
// Define Authentication Action Types
// ==============================
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_LOADING = 'AUTH_LOADING';
export const AUTH_ERROR = 'AUTH_ERROR';

// ==============================
// Define the structure of the Auth State
// ==============================
export interface AuthState {
  token: string | null; // Token can be a string or null
  userId: string | null; // User ID can be a string or null
  loading: boolean;      // Loading state
  error: string | null;  // Error message can be a string or null
}

// ==============================
// Define Action Interfaces
// ==============================
export interface AuthLoginAction {
  type: typeof AUTH_LOGIN;
  payload: {
    token: string;  // Token from the API
    userId: string; // User ID from the API
  };
}

export interface AuthLogoutAction {
  type: typeof AUTH_LOGOUT;
}

export interface AuthLoadingAction {
  type: typeof AUTH_LOADING;
}

export interface AuthErrorAction {
  type: typeof AUTH_ERROR;
  payload: { error: string }; // Error message payload
}

// ==============================
// Combine Action Types into a single type
// ==============================
export type AuthActionTypes = 
  | AuthLoginAction 
  | AuthLogoutAction 
  | AuthLoadingAction 
  | AuthErrorAction;
