const express = require("express");
const usersController = require("./users.controller");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth");

router.get("/", usersController.getAll); // No auth required
router.get("/:id", authMiddleware, usersController.getById); // Auth required
router.post("/create", usersController.create);
router.put("/:id", authMiddleware, usersController.update); // Auth required
router.delete("/:id", authMiddleware, usersController.delete); // Auth required

module.exports = router;
