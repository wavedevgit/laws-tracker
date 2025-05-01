import fs from "fs/promises";

export async function readFile(path) {
  try {
    return JSON.parse(await fs.readFile(path, "utf-8"));
  } catch {
    return {};
  }
}

const updates = [];

let sendUpdates = async (data) => {
  updates.push(data);
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export { sendUpdates, wait };
