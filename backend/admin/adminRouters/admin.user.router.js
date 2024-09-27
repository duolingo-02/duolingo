const express = require("express");
const adminUserRouter = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../adminControllers/admin.user.controller");

adminUserRouter.get("/all", getAllUsers);
adminUserRouter.get("/:id", getUserById);
adminUserRouter.put("/update/:id", updateUser);
adminUserRouter.delete("/delete/:id", deleteUser);

module.exports = adminUserRouter;
