const express = require("express");
const router = express.Router();
const Database = require("../db/db");
const { getAllProgram } = require("../db/repositories/program.repository");

router.get("/program/get-all-program", async (req, res) => {
  try {
    const db = new Database();
    const data = (await db.from("program"))
      .select("*")
      .eq("title", "Program 3")
      .end();

    res.status(200).json({
      data: data,
      succes: true,
      timestamp: Date.now(),
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Error",
      succes: false,
      timestamp: Date.now(),
    });
  }
});

router.post(`/program/register-program`, async (req, res) => {
  const {
    first_name,
    last_name,
    phone,
    age,
    email,
    national,
    size,
    program_id,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !phone ||
    !age ||
    !email ||
    !national ||
    !size ||
    !program_id
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request", success: false, timestamp: Date.now() });
  }

  console.log(req.body);

  res
    .status(201)
    .json({ data: "Successful Register,success:true,timestamp:Date.now()" });
});

module.exports = router;
