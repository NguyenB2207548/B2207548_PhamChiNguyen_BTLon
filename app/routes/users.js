const express = require("express");
const router = express.Router();
const Reader = require("../models/Reader");
const Staff = require("../models/Staff");
const authMiddleware = require("../middleware/authMiddleware");

// UPDATE
router.put("/update", authMiddleware, async (req, res) => {
  const { role, id } = req.user;
  const updates = req.body;

  try {
    let updatedUser;
    if (role === "reader") {
      updatedUser = await Reader.findByIdAndUpdate(id, updates, { new: true });
    } else if (role === "staff") {
      updatedUser = await Staff.findByIdAndUpdate(id, updates, { new: true });
    } else {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});

// DELETE
router.delete("/:maDG", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res
        .status(403)
        .json({ message: "Chỉ nhân viên mới có quyền xóa độc giả" });
    }

    const maDG = req.params.maDG;

    const deleted = await Reader.findOneAndDelete({ maDG });

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }

    res.json({ message: "Đã xóa độc giả thành công", deleted });
  } catch (err) {
    console.error("Lỗi khi xóa độc giả:", err);
    res.status(500).json({ message: "Lỗi server khi xóa độc giả" });
  }
});

module.exports = router;
