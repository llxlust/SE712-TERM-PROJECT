const express = require("express");
const bodyParser = require("body-parser");
const AppRouter = require("./router/app.route");
const User = require("./db/db");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(`/api/v1/`, AppRouter);
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
