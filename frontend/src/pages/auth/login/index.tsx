import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';
import Link from 'next/link';

import { login } from "../../../redux/actions/authActions";
import { AppDispatch, RootState } from "../../../redux/store/store";

import {
  buttonStyles,
  containerStyles,
  formStyles,
  typographyStyles,
} from "../../../styles/styles";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        login({ email, passwordHash: password })
      ).unwrap();
  
      localStorage.setItem("token", response.token);
      
      console.log("Token set in localStorage:", response.token);
      router.push("/");
    } catch (err) {
      const errorMessage = (err as any).message || "Login failed";
      console.error("Login failed", errorMessage);
    }
  };

  return (
    <div className={`${containerStyles.fullScreenCenter} p-4`}>
      <div className={containerStyles.secondCard}>
        <h1
          className={`${typographyStyles.heading1} text-blue-300 text-5xl text-center logoTitle`}
        >
          Lingoleap
        </h1>

        <h2 className={`${typographyStyles.heading2} mb-6 text-center`}>
          Login
        </h2>

        {error && (
          <p className="mb-4 text-center text-red-500">
            Login failed. Please check your information.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={formStyles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={formStyles.input}
            required
          />

          <button
            type="submit"
            className={`${buttonStyles.primary} mt-4`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-duolingoLight">
          Don't have an account?{" "}
          <Link href="/signup" className="underline">
            Create a profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;