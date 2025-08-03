const express = require("express");
const router = express.Router();
const publisherController = require("../controllers/publisherController");

router.post("/", publisherController.add);

module.exports = router;
