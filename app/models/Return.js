const mongoose = require("mongoose");

const ReturnSchema = new mongoose.Schema({
  maDocGia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reader",
    required: true,
  },
  maSach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  ngayMuon: {
    type: Date,
    required: true,
  },
  ngayHenTra: {
    type: Date,
    required: true,
  },
  ngayTra: {
    type: Date,
    required: true,
  },
  soNgayTre: {
    type: Number,
    default: 0,
  },
  tienPhat: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Return", ReturnSchema);
