const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Publisher = require("../models/Publisher");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sách:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách" });
  }
});

// ADD
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "staff") {
    return res
      .status(403)
      .json({ message: "Chỉ nhân viên mới được phép thêm sách" });
  }

  try {
    const {
      tenSach,
      donGia,
      soQuyen,
      namXuatBan,
      nguonGoc,
      tenNXB,
      diaChiNXB,
    } = req.body;

    const count = await Book.countDocuments();
    const nextCode = String(count + 1).padStart(3, "0");
    const maSach = `S${nextCode}`;

    let publisher = await Publisher.findOne({ tenNXB });

    if (!publisher) {
      const lastPublisher = await Publisher.findOne({})
        .sort({ maNXB: -1 })
        .collation({ locale: "en", numericOrdering: true });

      let nextCode = "001";
      if (lastPublisher && lastPublisher.maNXB) {
        const numberPart = parseInt(lastPublisher.maNXB.replace("NXB", ""));
        nextCode = String(numberPart + 1).padStart(3, "0");
      }

      const maNXB = `NXB${nextCode}`;

      publisher = new Publisher({
        maNXB: maNXB,
        tenNXB: tenNXB,
        diaChi: diaChiNXB || "Không rõ",
      });

      await publisher.save();
    }

    const newBook = new Book({
      maSach,
      tenSach,
      donGia,
      soQuyen,
      namXuatBan,
      nguonGoc,
      maNXB: publisher.maNXB,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi thêm sách mới", error: err.message });
  }
});

// DETAILS
router.get("/:maSach", async (req, res) => {
  const maSach = req.params.maSach;

  try {
    const book = await Book.findOne({ maSach: maSach });

    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    res.json(book);
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết sách:", err);
    res.status(500).json({ message: "Lỗi khi lấy chi tiết sách" });
  }
});

// UPDATE
router.put("/:maSach", async (req, res) => {
  const maSach = req.params.maSach;
  const { tenSach, donGia, soQuyen, namXuatBan, nguonGoc, tenNXB, diaChiNXB } =
    req.body;

  try {
    let publisher = await Publisher.findOne({ tenNXB });

    if (!publisher) {
      const lastPublisher = await Publisher.findOne()
        .sort({ maNXB: -1 })
        .collation({ locale: "en", numericOrdering: true });

      let nextCode = "001";
      if (lastPublisher && lastPublisher.maNXB) {
        const numberPart = parseInt(lastPublisher.maNXB.replace("NXB", ""));
        nextCode = String(numberPart + 1).padStart(3, "0");
      }

      const maNXB = `NXB${nextCode}`;
      publisher = new Publisher({
        maNXB,
        tenNXB,
        diaChi: diaChiNXB || "Không rõ",
      });
      await publisher.save();
    }

    const updatedBook = await Book.findOneAndUpdate(
      { maSach },
      {
        tenSach,
        donGia,
        soQuyen,
        namXuatBan,
        nguonGoc,
        maNXB: publisher.maNXB,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Không tìm thấy sách để sửa" });
    }

    res.json(updatedBook);
  } catch (err) {
    console.error("Lỗi khi cập nhật sách:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật sách", error: err.message });
  }
});

// DELETE
router.delete("/:maSach", async (req, res) => {
  const { maSach } = req.params;

  try {
    const deletedBook = await Book.findOneAndDelete({ maSach });

    if (!deletedBook) {
      return res.status(404).json({ message: "Không tìm thấy sách để xóa" });
    }

    res.json({ message: "Đã xóa sách thành công", book: deletedBook });
  } catch (err) {
    console.error("Lỗi khi xóa sách:", err);
    res.status(500).json({ message: "Lỗi khi xóa sách", error: err.message });
  }
});

module.exports = router;
