const express = require("express");
const bodyParser = require("body-parser");
const AppRouter = require("./router/app.route");
const User = require("./db/db");
const path = require("path");
const app = express();
const PORT = 3000;
const cookieParser = require("cookie-parser");

const Protect = require("./middlewares/protect");

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(`/api/v1/`, AppRouter);
app.get(`/private/admin`, Protect, (req, res) => {
  res.sendFile(path.join(__dirname, "./private/dashboard.html"));
});
app.get(`/private/admin/runner`, (req, res) => {
  res.sendFile(path.join(__dirname, "./private/runner.html"));
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
