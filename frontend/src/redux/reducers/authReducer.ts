import { AuthState, AuthActionTypes, AUTH_LOGIN, AUTH_LOGOUT } from "../../types/authTypes";
import { AnyAction } from 'redux'; // Importing AnyAction from Redux

// Initial State
const initialState: AuthState = {
  token: null,
  userId: null,
  loading: false,
  error: null,
};

// Check if running in browser and access localStorage
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  initialState.token = token ? token : null; // Rehydrate token from localStorage if available
}

// Auth Reducer
const authReducer = (state = initialState, action: AuthActionTypes | AnyAction): AuthState => { // Use AnyAction here
  switch (action.type) {
    case AUTH_LOGIN:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        loading: false,
        error: null,
      };
    case AUTH_LOGOUT:
      // Clear token from localStorage on logout
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      return {
        ...state,
        token: null,
        userId: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;
