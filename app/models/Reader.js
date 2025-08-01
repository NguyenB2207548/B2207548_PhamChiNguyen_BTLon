const mongoose = require("mongoose");

const ReaderSchema = new mongoose.Schema({
  maDG: {
    type: String,
    required: true,
    unique: true,
  },
  hoLot: String,
  ten: String,
  ngaySinh: Date,
  phai: String,
  diaChi: String,
  dienThoai: String,
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Reader", ReaderSchema);
