import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login, logout, signup } from "../redux/actions/authActions";
import { AppDispatch, RootState } from "../redux/store/store";

// Define the structure of the decoded token
interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

// Utility function to check if the token is expired
const isTokenExpired = (exp: number): boolean => Date.now() >= exp * 1000;

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const isAuthenticated = Boolean(token);
  let isAdmin = false;

  // Decode token and verify expiration
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (isTokenExpired(decoded.exp)) {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/");
      } else {
        isAdmin = decoded.role === "admin";
      }
    } catch (err) {
      console.error("Failed to decode token", err);
      dispatch(logout());
    }
  }

  // Handle user login
  const loginUser = async (email: string, password: string) => {
    try {
      await dispatch(login({ email, passwordHash: password })).unwrap();
      if (token) navigate("/home");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  // Handle user registration
  const registerUser = async (formData: FormData) => {
    try {
      await dispatch(signup(formData)).unwrap();
      if (token) navigate("/home");
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  // Handle user logout
  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return {
    isAuthenticated,
    isAdmin,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
  };
}
