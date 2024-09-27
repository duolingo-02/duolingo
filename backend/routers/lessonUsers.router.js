const express = require("express");
const lessonsUsersController = require("../controllers/lessonUsers.controller");

const lessonsUsersRouter = express.Router();

lessonsUsersRouter.post("/post", lessonsUsersController.create);
lessonsUsersRouter.get("/get", lessonsUsersController.getAll);
lessonsUsersRouter.get("/:id", lessonsUsersController.getById);
lessonsUsersRouter.put("/:id", lessonsUsersController.update);
lessonsUsersRouter.delete("/:id", lessonsUsersController.delete);


lessonsUsersRouter.get(
  "/user/:userId/lessons",
  lessonsUsersController.getLessonsByUserId
);

lessonsUsersRouter.get(
  "/user/:userId/lessons/count",
  lessonsUsersController.getActiveAndCompletedLessonsCount
);

lessonsUsersRouter.get(
  "/user/:userId/points",
  lessonsUsersController.countPointsByUserId
);

module.exports = lessonsUsersRouter;
