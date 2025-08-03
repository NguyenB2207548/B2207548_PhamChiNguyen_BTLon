const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const returnController = require("../controllers/returnController");

router.post("/preview", authMiddleware, returnController.previewReturn);
router.post("/", authMiddleware, returnController.returnBook);

module.exports = router;
