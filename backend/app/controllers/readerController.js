const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Reader = require("../models/Reader");
const Staff = require("../models/Staff");

require("dotenv").config();

// TOKEN
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3d";

const generateToken = (user, role) => {
  return jwt.sign(
    {
      id: user._id,
      ma: role === "reader" ? user.maDG : user.maNV,
      role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

exports.registerReader = async (req, res) => {
  try {
    const { maDG, hoLot, ten, ngaySinh, phai, diaChi, dienThoai, password } =
      req.body;

    const existing = await Reader.findOne({ maDG });
    if (existing)
      return res.status(400).json({ message: "Mã độc giả đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const reader = new Reader({
      maDG,
      hoLot,
      ten,
      ngaySinh,
      phai,
      diaChi,
      dienThoai,
      password: hashedPassword,
    });

    await reader.save();
    res.status(201).json({ message: "Đăng ký độc giả thành công", reader });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi đăng ký độc giả", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { maSo, password } = req.body;

  try {
    // 1. Thử tìm trong Staff trước
    let user = await Staff.findOne({ maNV: maSo });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu" });

      const token = generateToken(user, "staff");
      return res.json({
        message: "Đăng nhập thành công",
        token,
        role: "staff",
        user,
        redirect: "/admin",
      });
    }

    // 2. Nếu không phải Staff, tìm trong Reader
    user = await Reader.findOne({ maDG: maSo });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy mã người dùng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu" });

    const token = generateToken(user, "reader");
    res.json({
      message: "Đăng nhập thành công",
      token,
      role: "reader",
      user,
      redirect: "/",
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đăng nhập", error: err.message });
  }
};
