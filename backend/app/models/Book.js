const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  maSach: {
    type: String,
    required: true,
    unique: true,
  },
  tenSach: {
    type: String,
    required: true,
  },
  tacGia: {
    type: String,
    required: true,
  },
  theLoai: {
    type: String,
    required: true,
  },
  soQuyen: {
    type: Number,
    min: [0, "Số quyển không được âm"],
    validate: {
      validator: Number.isInteger,
      message: "Số quyển phải là số nguyên",
    },
  },
  namXuatBan: {
    type: Number,
    min: [1, "Năm xuất bản không hợp lệ"],
    max: [new Date().getFullYear(), "Năm xuất bản vượt quá hiện tại"],
  },
  nguonGoc: String,
  maNXB: {
    type: String,
    required: true,
    ref: "Publisher",
  },
  hinhAnh: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Book", BookSchema);
