import fs from "fs/promises";
import { Telegraf, Markup } from "telegraf";

export async function readFile(path) {
  try {
    return JSON.parse(await fs.readFile(path, "utf-8"));
  } catch {
    return {};
  }
}

let sendUpdates = async (data) => {
  const bot = new Telegraf(process.env.POSTER_TOKEN || "token");
  let updates = "";
  for (let update of data.diff.added) {
    updates += `• Nouveau numéro \`${
      update.num
    }\` ajouté avec la date \`${new Date(
      update.date
    ).toLocaleDateString()}\`\n\n`;
  }
  const markup = Markup.inlineKeyboard(
    data.diff.added.map((update) =>
      Markup.button.url(
        `📩 ${update.num}`,
        update.url.startsWith("/")
          ? "http://www.sgg.gov.ma" + update.url
          : update.url
      )
    )
  );
  await bot.telegram.sendMessage(
    "@jaridarasmia",
    `*📢 Jarida rasmia a été modifier*\n\n\**Type:**\`${data.type}\`\n${updates}`,
    { parse_mode: "MarkdownV2" }
  );
  await bot.telegram.sendMessage("@jaridarasmia", "📩PDFS", markup);
};
let onReady = () => null;
const whenReady = (action) => {
  onReady = action;
};
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export { sendUpdates, whenReady, wait };
