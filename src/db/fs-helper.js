const { readFile, writeFile } = require("fs/promises");

async function readData(path) {
  try {
    const rawData = await readFile(path, "utf8");
    const jsonData = JSON.parse(rawData);

    return { data: jsonData, ok: true };
  } catch (error) {
    return { data: null, ok: false };
  }
}

async function writeData(path, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);

    await writeFile(path, jsonData, "utf8");

    return { data, ok: true };
  } catch (error) {
    return { data: null, ok: false };
  }
}

module.exports = { readData, writeData };
