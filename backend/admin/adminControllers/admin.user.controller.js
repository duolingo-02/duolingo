const User = require("../../models/user.model");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      // Example of mapping through users to add additional data or modify the response
      const modifiedUsers = users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        totalPoints: user.totalPoints,
        createdAt: user.createdAt,
        // Add any additional fields or modifications here
      }));
      res.status(200).json(modifiedUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const user = await User.update(req.body, {
        where: { id: req.params.id },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await User.destroy({ where: { id: req.params.id } });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
