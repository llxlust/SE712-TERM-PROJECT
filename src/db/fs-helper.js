const { readFile } = require("fs/promises");
async function readData(path) {
  try {
    const rawData = await readFile(path, "utf8");
    const jsonData = JSON.parse(rawData);
    return { data: jsonData, ok: true };
  } catch (error) {
    return { data: null, ok: false };
  }
}
module.exports = { readData };
