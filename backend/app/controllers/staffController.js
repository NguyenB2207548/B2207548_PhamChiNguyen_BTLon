const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

exports.registerStaff = async (req, res) => {
  try {
    const { maNV, hoTenNV, password, chucVu, diaChi, soDienThoai } = req.body;

    const existing = await Staff.findOne({ maNV });
    if (existing)
      return res.status(400).json({ message: "Mã nhân viên đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = new Staff({
      maNV,
      hoTenNV,
      password: hashedPassword,
      chucVu,
      diaChi,
      soDienThoai,
    });

    await staff.save();
    res.status(201).json({ message: "Đăng ký nhân viên thành công", staff });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi đăng ký nhân viên", error: err.message });
  }
};

exports.loginStaff = async (req, res) => {
  try {
    const { maNV, password } = req.body;

    const staff = await Staff.findOne({ maNV });
    if (!staff)
      return res.status(404).json({ message: "Không tìm thấy mã nhân viên" });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu" });

    const token = generateToken(staff, "staff");

    res.json({ message: "Đăng nhập thành công", token, user: staff });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đăng nhập", error: err.message });
  }
};
