const express = require("express");
const router = express.Router();
const Database = require("../db/db");
const { getAllProgram } = require("../db/repositories/program.repository");
const { v4: uuidv4 } = require("uuid");

router.get("/program/get-all-program", async (req, res) => {
  try {
    const db = new Database();
    const data = (await db.from("program")).select("*").end();

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
    type,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !phone ||
    !age ||
    !email ||
    !national ||
    !size ||
    !program_id ||
    !type
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request", success: false, timestamp: Date.now() });
  }
  const db = new Database();
  const payload = { ...req.body, register_id: uuidv4() };
  const query = await db.from("register_user");

  const programs = await (await db.from("program")).select("*").end();
  const program = programs.data.find(
    (program) => program.id === payload.program_id,
  );
  const { bib_number, next_number } = generateBibNumber(program);

  const runner = {
    ...payload,
    bib_number,
  };
  const reg_query = await db.from("register_user");

  await reg_query.insert(runner).end();

  const updateDb = new Database();

  const updateProgramQuery = await updateDb.from("program");
  const nextBibNumber = program.last_bib_number + 1;
  const updateResult = await updateProgramQuery
    .update({
      last_bib_number: nextBibNumber,
    })
    .eq("id", program.id)
    .end();
  res.status(201).json({
    data: "Successful Register To Program",
    success: true,
    timestamp: Date.now(),
  });
});

module.exports = router;

function generateBibNumber(program) {
  const nextNumber = program.last_bib_number + 1;

  return {
    bib_number: `${program.bib_prefix}${String(nextNumber).padStart(4, "0")}`,
    next_number: nextNumber,
  };
}
