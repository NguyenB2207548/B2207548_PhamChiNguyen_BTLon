const mongoose = require("mongoose");

const PublisherSchema = new mongoose.Schema({
  maNXB: {
    type: String,
    required: true,
    unique: true,
  },
  tenNXB: {
    type: String,
    required: true,
  },
  diaChi: String,
});

module.exports = mongoose.model("Publisher", PublisherSchema);
