const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Staff = require("../models/Staff");

const readerController = require("../controllers/readerController");
const staffController = require("../controllers/staffController");

// ĐĂNG KÝ ĐỘC GIẢ
router.post("/register/reader", readerController.registerReader);

// ĐĂNG NHẬP ĐỘC GIẢ
router.post("/login/reader", readerController.loginUser);

// ĐĂNG KÝ NHÂN VIÊN
router.post("/register/staff", staffController.registerStaff);

// ĐĂNG NHẬP NHÂN VIÊN
router.post("/login/staff", staffController.loginStaff);

module.exports = router;
