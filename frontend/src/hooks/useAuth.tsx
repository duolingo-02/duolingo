import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, signup } from "../redux/actions/authActions";
import { AppDispatch, RootState } from "../redux/store/store";

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

const isTokenExpired = (exp: number): boolean => Date.now() >= exp * 1000;

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading, error } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = Boolean(token);
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (isTokenExpired(decoded.exp)) {
        dispatch(logout());
        localStorage.removeItem("token");
      } else {
        isAdmin = decoded.role === "admin";
      }
    } catch (err) {
      console.error("Failed to decode token", err);
      dispatch(logout());
    }
  }

  const loginUser = async (email: string, password: string) => {
    try {
      await dispatch(login({ email, passwordHash: password })).unwrap();
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const registerUser = async (formData: FormData) => {
    try {
      await dispatch(signup(formData)).unwrap();
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem("token");
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



