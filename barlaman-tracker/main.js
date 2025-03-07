/**
 * This tracks the most important sections on "sgg.gov.ma" and "chambredesrepresentants.ma" website
 * Hopefully you find this useful
 */

import fs from "fs/promises";
import rsstojson from "rss-to-json";
import { jarida } from "./trackers/jarida.js";
import { adala } from "./trackers/adala.js";

const { parse } = rsstojson;
const rss = async () => {
  const types = [
    "news",
    "evenements-archives",
    "legislation/loi-discussion-assemblee",
  ];
  const path = "./data/barlaman-feed/";
  for (let type of types) {
    console.log("Downloaded rss feed for category:", type);
    const feed = await parse(
      `https://www.chambredesrepresentants.ma/ar/${type}/rss`
    );
    await fs.writeFile(
      path.concat(type.replace("/", "_"), ".json"),
      JSON.stringify(feed, null, 4)
    );
  }
};

// download data
await jarida();
await adala();
await rss();
