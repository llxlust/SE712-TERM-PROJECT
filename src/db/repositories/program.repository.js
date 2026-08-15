const Database = require("../db");

const getAllProgram = async () => {
  const db = new Database();
  return await db.from("program").select("*").end();
};

module.exports = { getAllProgram };
