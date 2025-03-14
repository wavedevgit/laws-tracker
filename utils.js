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
  if (data.category === "jarida") {
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
  }
  if (data.category === "adala") {
    let updates = "";
    for (let update of data.diff.added) {
      updates += `• Nouveau fichier ajouté avec la date \`${new Date(
        update.fileMeta.gregorianDate
      ).toLocaleDateString()}\` (${update.fileMeta.LawType?.name} ${
        update.fileMeta.theme.name
      } ${update.fileMeta?.lawNumber || ""})\n\n`;
    }
    for (let update of data.diff.added) {
      updates += `• ❌ Fichier supprimé avec la date \`${new Date(
        update.fileMeta.gregorianDate
      ).toLocaleDateString()}\` (${update.fileMeta.LawType?.name} ${
        update.fileMeta.theme.name
      } ${update.fileMeta?.lawNumber || ""})\n\n`;
    }
    let i = 0;

    const btns = [
      data.diff.added.map((update) => {
        i += 1;
        return Markup.button.url(
          `📩 ${i} (ajouté)`,
          "https://adala.justice.gov.ma/api/" + update.path
        );
      }),
      data.diff.removed.map((update) => {
        i += 1;
        return Markup.button.url(
          `📩 ${i} (supprimé)`,
          "https://adala.justice.gov.ma/api/" + update.path
        );
      }),
    ];

    const markup = Markup.inlineKeyboard(btns);
    await bot.telegram.sendMessage(
      "@jaridarasmia",
      `*📢 Adala a été modifier*\n${updates}`,
      { parse_mode: "MarkdownV2" }
    );
    await bot.telegram.sendMessage("@jaridarasmia", "📩PDFS", markup);
  }
};
let onReady = () => null;
const whenReady = (action) => {
  onReady = action;
};
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export { sendUpdates, whenReady, wait };
