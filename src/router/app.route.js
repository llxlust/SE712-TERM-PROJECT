const express = require("express");
const router = express.Router();
const Database = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const upload = require("../middlewares/upload");

router.get("/program/get-all-program", async (req, res) => {
  try {
    const db = new Database();
    const data = await (await db.from("program")).select("*").end();
    res.status(200).json({
      data: data.data,
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

router.get("/program/get-all-runner", async (req, res) => {
  try {
    const db = new Database();
    const data = await (await db.from("register_user")).select("*").end();
    res.status(200).json({
      data: data.data,
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

router.get("/program/runner/:runner_id", async (req, res) => {
  try {
    const { runner_id } = req.params;
    if (!runner_id) {
      return res
        .status(400)
        .json({ data: "Bad Request", success: false, timestamp: Date.now() });
    }
    const db = new Database();
    const data = await (await db.from("register_user"))
      .select("*")
      .eq("register_id", runner_id)
      .end();
    res.status(200).json({
      data: data.data[0] ?? null,
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

router.patch("/program/runner/:runner_id", async (req, res) => {
  try {
    const payload = req.body;
    const { runner_id } = req.params;
    const db = new Database();
    const query = await db.from("register_user");
    await query.update(payload).eq("register_id", runner_id).end();

    const select_db = new Database();
    const select_query = await db.from("register_user");

    const { data } = await select_query
      .select("*")
      .eq("register_id", runner_id)
      .end();

    res.status(201).json({
      data: data[0],
      success: true,
      timestamp: Date.now(),
    });
  } catch (error) {
    res.status(500).json({
      error: data,
      succes: false,
      timestamp: Date.now(),
    });
  }
});

router.post(`/program/register-program`, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      error: "Internal Error",
      succes: false,
      timestamp: Date.now(),
    });
  }
});

router.post(
  `/upload/profile-images`,
  upload("assets/profile-images").single("image"),
  async (req, res) => {
    const file_data = req.file;
    const path = `assets/profile-images/${file_data.fieldname}`;
    res.json({
      data: {
        path: path,
      },
      success: true,
      timestamp: Date.now(),
    });
  },
);

router.post(`/auth/admin-login`, async (req, res) => {
  const db = new Database();
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Bad Request", success: false, timestamp: Date.now() });
  }

  const admin_stores = await db.from("admin");

  const data = await admin_stores
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .end();

  const isFound = data.data.length > 0;
  if (!isFound) {
    return res.status(401).json({
      error: "Invalid Crendetials",
      success: false,
      timestamp: Date.now(),
    });
  }

  const admin_data = data.data[0];
  const token = jwt.sign({ uuid: admin_data.id }, "secret");
  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({
    data: "Successful Login",
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
