const Reader = require("../models/Reader");
const Staff = require("../models/Staff");

exports.getAll = async (req, res) => {
  try {
    const readers = await Reader.find({}, "-__v").lean(); // loại bỏ __v, dùng lean để convert sang object JS
    const staffs = await Staff.find({}, "-__v").lean();

    // Thêm vai trò
    const readerAccounts = readers.map((reader) => ({
      ...reader,
      role: "reader",
    }));

    const staffAccounts = staffs.map((staff) => ({
      ...staff,
      role: "staff",
    }));

    // Gộp 2 loại tài khoản
    const allAccounts = [...readerAccounts, ...staffAccounts];

    res.status(200).json(allAccounts);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy tài khoản", details: err.message });
  }
};

exports.update = async (req, res) => {
  const { role, id } = req.user;
  const updates = req.body;

  try {
    let updatedUser;
    if (role === "reader") {
      updatedUser = await Reader.findByIdAndUpdate(id, updates, { new: true });
    } else if (role === "staff") {
      updatedUser = await Staff.findByIdAndUpdate(id, updates, { new: true });
    } else {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res
        .status(403)
        .json({ message: "Chỉ nhân viên mới có quyền xóa người dùng" });
    }

    const id = req.params.id;
    // console.log(id); undefined
    // Không cho phép xóa chính mình
    if (req.user.id === id) {
      return res
        .status(400)
        .json({ message: "Bạn không thể tự xóa chính mình" });
    }

    // Xóa trong Reader theo maDG
    const readerDeleted = await Reader.findOneAndDelete({ maDG: id });
    if (readerDeleted) {
      return res.json({
        message: "Đã xóa độc giả thành công",
        deleted: readerDeleted,
      });
    }

    // Xóa trong Staff theo maNV
    const staffDeleted = await Staff.findOneAndDelete({ maNV: id });
    if (staffDeleted) {
      return res.json({
        message: "Đã xóa nhân viên thành công",
        deleted: staffDeleted,
      });
    }

    // Không tìm thấy người dùng
    return res
      .status(404)
      .json({ message: "Không tìm thấy người dùng để xóa" });
  } catch (err) {
    console.error("Lỗi khi xóa người dùng:", err);
    res.status(500).json({ message: "Lỗi server khi xóa người dùng" });
  }
};
