import { readFile } from "../utils";
import fs from "fs/promises";

async function getLatestCommitHash(owner, repo, branch = "main") {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.sha;
}

async function main() {
  const commitHash = await getLatestCommitHash("wavedevgit", "laws-tracker");
  const changes = await readFile("./data/changes.json");
  const currentChanges = await readFile("./data/temp_changes.json");
  changes[commitHash.slice(7)] = currentChanges;
  await fs.writeFile(
    "./data/changes.json",
    JSON.stringify(changes, null, 4),
    "utf-8"
  );
}

main();
