const express = require("express");
const router = express.Router();
const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const Reader = require("../models/Reader");
const Return = require("../models/Return");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "reader") {
      return res.status(403).json({ message: "Chỉ độc giả mới được trả sách" });
    }

    const { maSach } = req.body;

    const book = await Book.findOne({ maSach });
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    const reader = await Reader.findOne({ maDG: req.user.ma });
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }

    // ✅ Tìm bản ghi mượn đã được duyệt và chưa trả
    const borrow = await Borrow.findOne({
      maDocGia: reader._id,
      maSach: book._id,
      daTra: false,
      trangThai: "approved",
    });

    if (!borrow) {
      return res.status(404).json({
        message:
          "Không tìm thấy bản ghi mượn sách chưa trả hoặc chưa được duyệt",
      });
    }

    const ngayTra = new Date();
    const ngayHenTra = borrow.ngayTra;
    const soNgayTre = Math.max(
      0,
      Math.ceil((ngayTra - new Date(ngayHenTra)) / (1000 * 60 * 60 * 24))
    );
    const tienPhat = soNgayTre * (book.donGia * 0.01);

    // Cập nhật trạng thái đã trả
    borrow.daTra = true;
    borrow.ngayTra = ngayTra;
    await borrow.save();

    // Ghi log bảng Return nếu cần
    const returnRecord = new Return({
      maDocGia: reader._id,
      maSach: book._id,
      ngayMuon: borrow.ngayMuon,
      ngayHenTra: borrow.ngayTra,
      ngayTra,
      soNgayTre,
      tienPhat,
    });

    await returnRecord.save();

    // Tăng lại số lượng sách
    book.soQuyen += 1;
    await book.save();

    res.status(200).json({
      message: "Trả sách thành công",
      phat: tienPhat,
      soNgayTre,
      returnRecord,
    });
  } catch (err) {
    console.error("Lỗi khi trả sách:", err);
    res.status(500).json({ message: "Lỗi server khi trả sách" });
  }
});

module.exports = router;
