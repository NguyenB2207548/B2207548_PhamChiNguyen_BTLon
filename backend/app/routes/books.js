const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Book = require("../models/Book");
const Publisher = require("../models/Publisher");
const authMiddleware = require("../middleware/authMiddleware");
const bookController = require("../controllers/bookController");

// Cấu hình lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "app/uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// GET ALL
router.get("/", bookController.getAll);

// ADD sách mới + upload ảnh
router.post(
  "/",
  authMiddleware,
  upload.single("image"), // tên field ảnh là "image"
  bookController.add
);

router.get("/sameCategory", bookController.getBooksSameCategory);

router.get("/:maSach", bookController.details);

router.put("/:maSach", authMiddleware, bookController.update);

router.delete("/:maSach", authMiddleware, bookController.delete);

module.exports = router;
