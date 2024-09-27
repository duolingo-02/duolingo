// Import necessary modules
const express = require("express");
const UserRouter = express.Router();
const upload = require("../config/multerConfig");
const { authenticate } = require("../middleware/index");

// Import controller functions
const {
  userLogin,
  userSignup,
  updateUserProfile,
  updateUserPassword,
  getCurrentUser,
  getUserPointsById,
} = require("../controllers/user.controller");

//* Routes for user authentication
// User registration with profile picture
UserRouter.post("/register", upload.single("profilePicture"), userSignup);
// User login
UserRouter.post("/login", userLogin);

//* Routes for authenticated users
// Get current user info
UserRouter.get("/me", authenticate, getCurrentUser);
// Update user profile
UserRouter.put(
  "/me/profile",
  authenticate,
  upload.single("profilePicture"),
  updateUserProfile
);
// Update user password
UserRouter.put("/me/password", authenticate, updateUserPassword);

//* Other routes
// Get user points by ID
UserRouter.get("/points/:id", getUserPointsById);

module.exports = UserRouter;
