const Publisher = require("../models/Publisher");

exports.add = async (req, res) => {
  try {
    const count = await Publisher.countDocuments();
    const nextCode = String(count + 1).padStart(3, "0");
    const maNXB = `NXB${nextCode}`;

    const newPublisher = new Publisher({
      maNXB: maNXB,
      tenNXB: req.body.tenNXB,
      diaChi: req.body.diaChi,
    });

    await newPublisher.save();
    res.status(201).json(newPublisher);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi thêm nhà xuất bản", error: err.message });
  }
};
