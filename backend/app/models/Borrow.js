const mongoose = require("mongoose");

const BorrowSchema = new mongoose.Schema({
  maDocGia: { type: mongoose.Schema.Types.ObjectId, ref: "Reader" },
  maSach: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  ngayMuon: Date,
  ngayTra: Date,
  daTra: { type: Boolean, default: false },

  trangThai: {
    type: String,
    enum: ["pending", "approved", "rejected", "returned"],
    default: "pending",
  },
});

module.exports = mongoose.model("Borrow", BorrowSchema);
