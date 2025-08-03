const Book = require("../models/Book");
const Publisher = require("../models/Publisher");
const Borrow = require("../models/Borrow");

exports.getAll = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sách:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách" });
  }
};

exports.add = async (req, res) => {
  try {
    const {
      tenSach,
      theLoai,
      tacGia,
      soQuyen,
      namXuatBan,
      nguonGoc,
      tenNXB,
      diaChiNXB,
    } = req.body;

    // ✅ Sinh mã sách duy nhất (dựa trên mã lớn nhất hiện có)
    const lastBook = await Book.findOne()
      .sort({ maSach: -1 })
      .collation({ locale: "en", numericOrdering: true });

    let nextCode = "001";
    if (lastBook && lastBook.maSach) {
      const numberPart = parseInt(lastBook.maSach.replace("S", ""));
      nextCode = String(numberPart + 1).padStart(3, "0");
    }

    const maSach = `S${nextCode}`;

    // ✅ Tìm hoặc tạo nhà xuất bản
    let publisher = await Publisher.findOne({ tenNXB });

    if (!publisher) {
      const lastPublisher = await Publisher.findOne({})
        .sort({ maNXB: -1 })
        .collation({ locale: "en", numericOrdering: true });

      let nextPublisherCode = "001";
      if (lastPublisher && lastPublisher.maNXB) {
        const numberPart = parseInt(lastPublisher.maNXB.replace("NXB", ""));
        nextPublisherCode = String(numberPart + 1).padStart(3, "0");
      }

      const maNXB = `NXB${nextPublisherCode}`;

      publisher = new Publisher({
        maNXB,
        tenNXB,
        diaChi: diaChiNXB || "Không rõ",
      });

      await publisher.save();
    }

    // ✅ Xử lý ảnh đã upload qua multer
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newBook = new Book({
      maSach,
      tenSach,
      tacGia,
      theLoai,
      soQuyen,
      namXuatBan,
      nguonGoc,
      maNXB: publisher.maNXB,
      hinhAnh: imagePath,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi khi thêm sách mới",
      error: err.message,
    });
  }
};

exports.details = async (req, res) => {
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
};

exports.update = async (req, res) => {
  const maSach = req.params.maSach;
  const { tenSach, tacGia, theLoai, soQuyen, namXuatBan, nguonGoc } = req.body;

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { maSach },
      {
        tenSach,
        tacGia,
        theLoai,
        soQuyen,
        namXuatBan,
        nguonGoc,
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
};

exports.delete = async (req, res) => {
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
};

// TÌM KIẾM THEO THỂ LOẠI
exports.getTheLoai = async (req, res) => {
  try {
    const { theLoai } = req.query;

    if (!theLoai) {
      return res.status(400).json({ message: "Thiếu tham số thể loại" });
    }

    // Tìm sách theo thể loại (không phân biệt chữ hoa/thường)
    const books = await Book.find({
      theLoai: { $regex: new RegExp(theLoai, "i") },
    });

    res.json(books);
  } catch (err) {
    console.error("Lỗi tìm sách theo thể loại:", err);
    res.status(500).json({ message: "Lỗi server khi tìm sách" });
  }
};

// SÁCH CÙNG THỂ LOẠI
exports.getBooksSameCategory = async (req, res) => {
  try {
    const { theLoai, maSach } = req.query;

    if (!theLoai) {
      return res.status(400).json({ message: "Thiếu thể loại." });
    }

    const books = await Book.find({
      theLoai,
      maSach: { $ne: maSach },
    }).limit(4);

    res.json(books);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy sách cùng thể loại", error: err.message });
  }
};

exports.getNewestBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .sort({ namXuatBan: -1 }) // Sắp xếp theo năm xuất bản giảm dần
      .limit(4); // Lấy 4 sách mới nhất

    res.json(books);
  } catch (err) {
    console.error("Lỗi khi lấy sách mới:", err);
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy sách mới", error: err.message });
  }
};

exports.getMostBorrowedBooks = async (req, res) => {
  try {
    // Đếm số lượt mượn theo mã sách (maSach là ObjectId tham chiếu đến Book._id)
    const topBorrowed = await Borrow.aggregate([
      {
        $group: {
          _id: "$maSach", // group theo ObjectId
          totalBorrows: { $sum: 1 },
        },
      },
      { $sort: { totalBorrows: -1 } },
      { $limit: 3 },
    ]);

    // Lấy danh sách Book theo danh sách _id
    const bookIds = topBorrowed.map((item) => item._id);
    const books = await Book.find({ _id: { $in: bookIds } }).lean();

    // Gắn số lượt mượn vào từng sách
    const booksWithCount = books.map((book) => {
      const borrowInfo = topBorrowed.find(
        (b) => String(b._id) === String(book._id)
      );
      return {
        ...book,
        totalBorrows: borrowInfo?.totalBorrows || 0,
      };
    });

    res.json(booksWithCount);
  } catch (err) {
    console.error("Lỗi khi lấy sách mượn nhiều nhất:", err);
    res.status(500).json({
      message: "Lỗi server khi lấy sách mượn nhiều nhất",
      error: err.message,
    });
  }
};

// THE LOAI
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Book.distinct("theLoai");
    res.json(genres);
  } catch (err) {
    console.error("Lỗi khi lấy thể loại:", err);
    res.status(500).json({
      message: "Lỗi server khi lấy thể loại",
      error: err.message,
    });
  }
};
