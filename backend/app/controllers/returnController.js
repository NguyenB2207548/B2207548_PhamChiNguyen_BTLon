const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const Reader = require("../models/Reader");
const Return = require("../models/Return");

exports.returnBook = async (req, res) => {
  try {
    const { maSach, maDG } = req.body;

    const book = await Book.findById(maSach);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    const reader = await Reader.findById(maDG);
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }

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
    const tienPhat = soNgayTre * 10000;

    // Cập nhật trạng thái đã trả
    borrow.daTra = true;
    borrow.ngayTra = ngayTra;
    borrow.trangThai = "returned";
    await borrow.save();

    // Ghi log bảng Return
    const returnRecord = new Return({
      maDocGia: reader._id,
      maSach: book._id,
      ngayMuon: borrow.ngayMuon,
      ngayHenTra: borrow.ngayTra,
      ngayTra,
      soNgayTre,
      tienPhat,
      maNV: req.user.maNV, // ghi nhận nhân viên thực hiện
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
};

// POST /api/returns/preview
exports.previewReturn = async (req, res) => {
  try {
    const { maSach, maDG } = req.body;

    const book = await Book.findById(maSach);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    const reader = await Reader.findById(maDG);
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }

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
    const tienPhat = soNgayTre * 10000;

    res.status(200).json({
      ngayMuon: borrow.ngayMuon,
      ngayHenTra,
      ngayTra,
      soNgayTre,
      tienPhat,
      maSach,
      tenSach: book.tenSach,
      maDG,
      tenDG: `${reader.hoLot} ${reader.ten}`,
    });
  } catch (err) {
    console.error("Lỗi khi xem trước trả sách:", err);
    res.status(500).json({ message: "Lỗi server khi xem trước trả sách" });
  }
};
