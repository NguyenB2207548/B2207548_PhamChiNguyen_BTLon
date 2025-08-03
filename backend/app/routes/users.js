const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// GET ALL
router.get("/getAll", userController.getAll);

// UPDATE
router.put("/update", authMiddleware, userController.update);

// DELETE
router.delete("/:id", authMiddleware, userController.delete);

module.exports = router;
