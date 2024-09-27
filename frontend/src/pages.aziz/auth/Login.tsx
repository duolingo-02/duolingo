// ==============================
// Importing React, Redux, and Navigation
// ==============================
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// ==============================
// Importing Actions and Store
// ==============================
import { login } from "../../redux/actions/authActions";
import { AppDispatch, RootState } from "../../redux/store/store";

// ==============================
// Importing Styles
// ==============================
import {
  buttonStyles,
  containerStyles,
  formStyles,
  typographyStyles,
} from "../../styles/styles";

/**
 * Login Component
 *
 * Allows users to log in by entering their email and password.
 * Handles login form submission and navigation to the home page upon success.
 */
const Login: React.FC = () => {
  // ==============================
  // Local State
  // ==============================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  // ==============================
  // Handle Form Submission
  // ==============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Dispatch login action with email and password
      const response = await dispatch(
        login({ email, passwordHash: password })
      ).unwrap();

      // Store token in localStorage and navigate to home
      localStorage.setItem("token", response.token);
      navigate("/home");
    } catch (err) {
      const errorMessage = (err as any).message || "Login failed";
      console.error("Login failed", errorMessage);
    }
  };

  return (
    <div className={`${containerStyles.fullScreenCenter} p-4`}>
      <div className={containerStyles.secondCard}>
        {/* Title */}
        <h1
          className={`${typographyStyles.heading1} text-blue-300 text-5xl text-center logoTitle`}
        >
          Lingoleap
        </h1>

        {/* Subtitle */}
        <h2 className={`${typographyStyles.heading2} mb-6 text-center`}>
          Login
        </h2>

        {/* Error message */}
        {error && (
          <p className="mb-4 text-center text-red-500">
            Login failed. Please check your information.
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email/Username Input */}
          <input
            type="email"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={formStyles.input}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={formStyles.input}
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className={`${buttonStyles.primary} mt-4`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Redirect to Signup */}
        <p className="mt-4 text-center text-duolingoLight">
          Don't have an account?{" "}
          <Link to="/register" className="underline">
            Create a profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
