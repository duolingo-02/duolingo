// Import necessary modules
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const domain = "http://127.0.0.1:1274/uploads/";

// Export controller functions
module.exports = {
  // User signup

  userSignup: async (req, res) => {
    try {
      const { username, email, passwordHash, role } = req.body;

      // Validate inputs
      if (!username || !email || !passwordHash || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate role
      if (!["user", "admin", "teacher"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check password length
      if (passwordHash.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(passwordHash, saltRounds);

      // Add domain to profile picture if file is uploaded
      const profilePicture = req.file ? `${domain}${req.file.filename}` : null;

      // Create new user
      await User.create({
        username,
        email,
        passwordHash: hashedPassword,
        role,
        profilePicture,
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // User login
  userLogin: async (req, res) => {
    try {
      const { email, passwordHash } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(
        passwordHash,
        user.passwordHash
      );
      if (!passwordMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        userId: user.id,
        role: user.role,
        userName: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /// Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { username, email } = req.body;

      // Trouver l'utilisateur
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Si un fichier est uploadé, ajouter le domaine à l'URL de l'image
      const profilePicture = req.file
        ? `${domain}${req.file.filename}`
        : user.profilePicture;

      // Mettre à jour les informations de l'utilisateur
      await user.update({
        username: username || user.username,
        email: email || user.email,
        profilePicture, // Stocker l'URL complète avec le domaine
      });

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Update user password
  updateUserPassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Find user
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare current password
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await user.update({ passwordHash: hashedPassword });

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      const userId = req.user.id;

      // Find the current user
      const user = await User.findByPk(userId, {
        attributes: [
          "username",
          "email",
          "role",
          "profilePicture",
          "totalPoints",
        ],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user information" });
    }
  },

  // Get user points by ID
  getUserPointsById: async (req, res) => {
    try {
      // Find user points by ID
      const user = await User.findByPk(req.params.id, {
        attributes: ["totalPoints"],
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ totalPoints: user.totalPoints });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user points" });
    }
  },

  // Update user profile with picture
  updateUserProfileWithPicture: async (req, res) => {
    try {
      const userId = req.user.id;
      const { username, email } = req.body;

      // Trouver l'utilisateur
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Si un fichier est uploadé, ajouter le domaine à l'URL de l'image
      const profilePicture = req.file
        ? `${domain}${req.file.filename}`
        : user.profilePicture;

      // Mettre à jour les informations de l'utilisateur
      await user.update({
        username: username || user.username,
        email: email || user.email,
        profilePicture, // Stocker l'URL complète
      });

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
};
