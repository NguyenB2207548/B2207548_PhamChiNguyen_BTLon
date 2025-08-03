const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bookRouters = require("./app/routes/books");
const publisherRoutes = require("./app/routes/publishers");
const authRoutes = require("./app/routes/auth");
const userRoutes = require("./app/routes/users");
const borrowRoutes = require("./app/routes/borrows");
const returnRoutes = require("./app/routes/return");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("app/uploads"));

app.use("/api/books", bookRouters);
app.use("/api/publishers", publisherRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/returns", returnRoutes);

app.get("/", (req, res) => {
  res.send("Library API is running");
});

module.exports = app;
