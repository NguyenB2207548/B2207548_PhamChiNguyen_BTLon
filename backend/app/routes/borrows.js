const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const borrowController = require("../controllers/borrowController");

router.post("/", authMiddleware, borrowController.create);

router.put("/approve/:id", borrowController.approve);

router.put("/reject/:id", borrowController.reject);

router.get("/getAll", borrowController.getAll);

router.get("/getHistory", authMiddleware, borrowController.getHistory);

module.exports = router;
