const express = require("express");
const router = express.Router();
const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const Reader = require("../models/Reader");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "reader") {
      return res
        .status(403)
        .json({ message: "Chỉ độc giả mới được yêu cầu mượn sách" });
    }

    const { maSach, ngayMuon, ngayTra } = req.body;

    const book = await Book.findOne({ maSach });
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    if (book.soQuyen <= 0) {
      return res
        .status(400)
        .json({ message: "Sách đã hết, không thể gửi yêu cầu mượn" });
    }

    const reader = await Reader.findOne({ maDG: req.user.ma });
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }

    // Kiểm tra nếu đang có yêu cầu mượn chưa được xử lý
    const exists = await Borrow.findOne({
      maDocGia: reader._id,
      maSach: book._id,
      trangThai: { $in: ["pending", "approved"] },
      daTra: false,
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Bạn đã gửi yêu cầu hoặc đang mượn sách này" });
    }

    const borrow = new Borrow({
      maDocGia: reader._id,
      maSach: book._id,
      ngayMuon: new Date(ngayMuon),
      ngayTra: new Date(ngayTra),
    });

    await borrow.save();

    res.status(201).json({ message: "Yêu cầu mượn sách đã được gửi", borrow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi gửi yêu cầu mượn sách" });
  }
});

router.put("/approve/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res
        .status(403)
        .json({ message: "Chỉ nhân viên mới được duyệt yêu cầu mượn sách" });
    }

    const borrow = await Borrow.findById(req.params.id).populate("maSach");

    if (!borrow || borrow.trangThai !== "pending") {
      return res
        .status(404)
        .json({ message: "Yêu cầu không tồn tại hoặc đã xử lý" });
    }

    if (borrow.maSach.soQuyen <= 0) {
      return res.status(400).json({ message: "Sách đã hết, không thể duyệt" });
    }

    borrow.trangThai = "approved";
    borrow.nguoiDuyet = req.user.id;
    await borrow.save();

    borrow.maSach.soQuyen -= 1;
    await borrow.maSach.save();

    res.status(200).json({ message: "Đã duyệt yêu cầu mượn sách", borrow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi duyệt yêu cầu" });
  }
});

// REJECT
router.put("/reject/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res
        .status(403)
        .json({ message: "Chỉ nhân viên mới được từ chối yêu cầu" });
    }

    const borrow = await Borrow.findById(req.params.id);
    if (!borrow || borrow.trangThai !== "pending") {
      return res
        .status(404)
        .json({ message: "Yêu cầu không tồn tại hoặc đã xử lý" });
    }

    borrow.trangThai = "rejected";
    await borrow.save();

    res.status(200).json({ message: "Yêu cầu đã bị từ chối", borrow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi từ chối yêu cầu" });
  }
});

module.exports = router;
