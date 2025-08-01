const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  maNV: {
    type: String,
    required: true,
    unique: true,
  },
  hoTenNV: String,
  password: String,
  chucVu: String,
  diaChi: String,
  soDienThoai: String,
});

module.exports = mongoose.model("Staff", StaffSchema);
