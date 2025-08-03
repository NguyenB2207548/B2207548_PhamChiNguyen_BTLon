const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const Reader = require("../models/Reader");
const Return = require("../models/Return");

exports.create = async (req, res) => {
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
};

exports.approve = async (req, res) => {
  try {
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

    await borrow.save();

    borrow.maSach.soQuyen -= 1;
    await borrow.maSach.save();

    res.status(200).json({ message: "Đã duyệt yêu cầu mượn sách", borrow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi duyệt yêu cầu" });
  }
};

exports.reject = async (req, res) => {
  try {
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
};

exports.getAll = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("maDocGia", "ten") // lấy tên độc giả
      .populate("maSach", "tenSach") // lấy tên sách
      .sort({ createdAt: -1 });

    // Lọc thông tin cần thiết
    const result = borrows.map((borrow) => ({
      _id: borrow._id,
      maDocGia: borrow.maDocGia,
      maSach: borrow.maSach,
      tenDocGia: borrow.maDocGia?.ten || "Không rõ",
      tenSach: borrow.maSach?.tenSach || "Không rõ",
      ngayMuon: borrow.ngayMuon,
      ngayTra: borrow.ngayTra,
      trangThai: borrow.trangThai,
      daTra: borrow.daTra,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách mượn sách" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Lấy danh sách Borrow
    const borrows = await Borrow.find({ maDocGia: userId })
      .populate("maSach", "tenSach")
      .sort({ ngayMuon: -1 });

    // 2. Lấy danh sách Return
    const returns = await Return.find({ maDocGia: userId });

    // 3. Tạo map return: key = maDocGia_maSach_ngayMuon_ngayHenTra
    const returnMap = new Map();
    returns.forEach((r) => {
      const key = `${r.maDocGia}_${r.maSach}_${new Date(
        r.ngayMuon
      ).toISOString()}_${new Date(r.ngayHenTra).toISOString()}`;
      returnMap.set(key, r);
    });

    // 4. Kết hợp dữ liệu Borrow + Return
    const result = borrows.map((b) => {
      const key = `${b.maDocGia}_${b.maSach._id}_${new Date(
        b.ngayMuon
      ).toISOString()}_${new Date(b.ngayTra).toISOString()}`;
      const returnRecord = returnMap.get(key);

      const ngayHenTra = new Date(b.ngayTra);
      const ngayThucTeTra = returnRecord
        ? new Date(returnRecord.ngayTra)
        : null;
      const daTra = b.daTra;

      const soNgayTre = returnRecord
        ? returnRecord.soNgayTre
        : daTra
        ? Math.max(
            0,
            Math.ceil((new Date() - ngayHenTra) / (1000 * 60 * 60 * 24))
          )
        : 0;

      const tienPhat = returnRecord ? returnRecord.tienPhat : soNgayTre * 10000;

      return {
        _id: b._id,
        tenSach: b.maSach?.tenSach || "Không rõ",
        ngayMuon: b.ngayMuon,
        ngayHenTra: b.ngayTra,
        ngayTra: ngayThucTeTra,
        daTra,
        trangThai: b.trangThai, // approved, pending, rejected
        soNgayTre,
        tienPhat,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử:", err);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử" });
  }
};
