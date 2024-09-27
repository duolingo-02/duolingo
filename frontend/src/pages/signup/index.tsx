// ==============================
// Importing React, Redux, and Navigation
// ==============================
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'; // Keep this for Next.js navigation

// ==============================
// Importing Actions and Store
// ==============================
import { signup } from "../../redux/actions/authActions";
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
import Link from "next/link";

/**
 * Signup Component Props
 */
interface SignupProps {
  // Define props here if needed
}

/**
 * Signup Component
 *
 * Handles user registration, including validation and submission of profile data.
 * Allows users to upload a profile picture and agree to terms before signing up.
 */
const Signup: React.FC<SignupProps> = () => {
  // ==============================
  // Local State
  // ==============================
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // ==============================
  // Password Validation
  // ==============================
  const validatePassword = () => {
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  // ==============================
  // Handle Form Submission
  // ==============================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passwordValidationError = validatePassword();
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    // FormData to handle file upload
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("passwordHash", password);
    formData.append("role", role);
    if (profilePicture) {
      formData.append("file", profilePicture);
    }

    // Dispatch signup action and navigate to login upon success
    dispatch(signup(formData))
      .unwrap()
      .then(() => router.push("/login")) // Next.js routing
      .catch(() => {});
  };

  // ==============================
  // Handle Image Upload
  // ==============================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${containerStyles.fullScreenCenter} p-4`}>
      <div className={containerStyles.secondCard}>
        {/* Title and Subtitle */}
        <h1
          className={`${typographyStyles.heading1} text-blue-300 text-5xl text-center logoTitle`}
        >
          Lingoleap
        </h1>
        <h2 className={`${typographyStyles.heading2} mb-6 text-center`}>
          Register
        </h2>

        {/* Display error message if signup fails */}
        {error && (
          <p className="mb-4 text-center text-red-500">
            Signup failed. Please check your information.
          </p>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Username Input */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={formStyles.input}
            required
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
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

          {/* Confirm Password Input */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={formStyles.input}
            required
          />

          {/* Display password error if validation fails */}
          {passwordError && (
            <p className="mb-4 text-center text-red-500">{passwordError}</p>
          )}

          {/* Role Selection */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={formStyles.input}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
          </select>

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mt-4 mb-4">
            <div className="w-32 h-32 mb-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            <label className="block text-white">
              <span className="mb-2">Profile Picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`${formStyles.uploadButton} py-2 border-none`}
              />
            </label>
          </div>

          {/* Terms Agreement */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 text-blue-500 form-checkbox"
              />
              <span className="ml-2 text-white">
                I agree to the{" "}
                <Link href="/terms" className="underline">
                  terms and conditions
                </Link>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`${
              agreedToTerms
                ? buttonStyles.primary
                : "bg-gray-500 w-full py-3 text-xl font-bold text-duolingoLight rounded-full shadow-lg"
            } mt-4 transition-opacity duration-300`}
            disabled={loading || !agreedToTerms}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        {/* Redirect to login */}
        <p className="mt-4 text-center text-duolingoLight">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
