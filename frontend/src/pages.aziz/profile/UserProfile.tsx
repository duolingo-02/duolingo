// ==============================
// Importing React, Redux, and Actions
// ==============================
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import {
  fetchUserProfile,
  updateUserPassword,
  updateUserProfile,
  updateUserProfileWithPicture,
} from "../../redux/actions/userActions";
import { AppDispatch, RootState } from "../../redux/store/store";

// ==============================
// Importing Styles
// ==============================
import {
  buttonStyles,
  containerStyles,
  formStyles,
  profileStyles,
  typographyStyles,
} from "../../styles/styles";

/**
 * UserProfile Component
 *
 * Displays and allows the user to update their profile information and change their password.
 * One dynamic profile picture shared between both sections.
 */
const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selecting user data and status from Redux store
  const {
    profile: userProfile,
    status,
    error,
  } = useSelector((state: RootState) => state.user);

  // Local state for form data
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { username, email, currentPassword, newPassword, confirmPassword } =
    formState;

  // Fetch user profile if not already available
  useEffect(() => {
    if (!userProfile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userProfile]);

  // Update form state when user profile is fetched
  useEffect(() => {
    if (userProfile) {
      setFormState({
        username: userProfile.username,
        email: userProfile.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [userProfile]);

  // Handle input changes for the form
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  }, []);

  // Handle profile picture change and preview
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

  // Handle profile update submission
  const handleProfileSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (profilePicture) {
          const formData = new FormData();
          formData.append("username", username);
          formData.append("email", email);
          formData.append("profilePicture", profilePicture);
          await dispatch(updateUserProfileWithPicture(formData));
        } else {
          await dispatch(updateUserProfile({ username, email }));
        }
      } catch (err) {
        console.error("Profile update failed", err);
      }
    },
    [dispatch, username, email, profilePicture]
  );

  // Handle password update submission
  const handlePasswordSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        await dispatch(updateUserPassword({ currentPassword, newPassword }));
      } catch (err) {
        console.error("Password update failed", err);
      }
    },
    [dispatch, currentPassword, newPassword, confirmPassword]
  );

  // Handle logout action
  const handleLogOut = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  }, [dispatch]);

  // Handle loading and error states
  if (status === "loading") {
    return <div className="text-duolingoLight">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!userProfile) {
    return <div className="text-duolingoLight">No profile data available.</div>;
  }

  const profilePictureUrl =
    previewImage ||
    (userProfile.profilePicture
      ? `${userProfile.profilePicture}`
      : "https://static.vecteezy.com/ti/vecteur-libre/p1/8563281-lapin-s-emotion-sourire-tete-dans-oeuf-carte-anniversaire-vectoriel.jpg");

  return (
    <div className={`${containerStyles.fullWidthCenter} p-4`}>
      <div className={containerStyles.card}>
        <h2 className={typographyStyles.heading1}>Your Profile</h2>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Profile Information Card */}
          <div className={containerStyles.secondCard}>
            <h3 className={typographyStyles.heading4}>Profile Information</h3>
            {/* Shared Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className={profileStyles.pictureContainer}>
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className={profileStyles.picture}
                />
              </div>

              {/* Profile Picture Upload */}
              <label
                htmlFor="profilePicture"
                className={`${typographyStyles.subtitle} pt-0 pb-2`}
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
                className={formStyles.uploadButton}
              />
            </div>
            <form className="mt-8" onSubmit={handleProfileSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className={formStyles.label}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleChange}
                  className={formStyles.input}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className={formStyles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleChange}
                  className={formStyles.input}
                  required
                />
              </div>

              <button type="submit" className={buttonStyles.primary}>
                Update Profile
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className={containerStyles.secondCard}>
            <h3 className={typographyStyles.heading4}>Change Password</h3>
            <form className="mt-8" onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className={formStyles.label}>
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={handleChange}
                  className={formStyles.input}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className={formStyles.label}>
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={handleChange}
                  className={formStyles.input}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className={formStyles.label}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  className={formStyles.input}
                  autoComplete="new-password"
                  required
                />
              </div>
              <button type="submit" className={buttonStyles.secondary}>
                Update Password
              </button>
            </form>

            <button
              type="button"
              onClick={handleLogOut}
              className={`${buttonStyles.logout} mt-8`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
