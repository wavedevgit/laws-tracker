// adala.justice.gov.ma tracker
// Website comes with pdfs that have text copyable which is useful
import fs from "fs/promises";
import { readFile, wait } from "../../utils.js";
import { diffAdala } from "../differs.js";

const urls = {
  // returns latest sgg posts
  SGG_LATEST_DAY: "https://adala.justice.gov.ma/api/files/sgg-latest-day",
  SEARCH:
    "https://adala.justice.gov.ma/_next/data/THP5ZL1eNCinRAZ1hWfN0/ar/search.json?term=&themes=&start_date=&end_date=",
  LAW_THEMES: "https://adala.justice.gov.ma/api/files/themes",
  LAW_TYPES: "https://adala.justice.gov.ma/api/files/law-types",
};
const getJson = async (url) => await (await fetch(url)).json();

const adala = async () => {
  const themes = await getJson(urls.LAW_THEMES);
  const types = await getJson(urls.LAW_TYPES);
  const sggLatestDay = await getJson(urls.SGG_LATEST_DAY);
  // start the downloading process of every page
  const perPage = 15;
  let result = [];
  const content = await getJson(urls.SEARCH + "&page=1");
  const total = content.pageProps.searchResult.total;
  result.push(...content.pageProps.searchResult.data);
  for (let i = 2; i < Math.round(total / perPage) + 1; i++) {
    console.log("At page:", i);
    const page = await getJson(urls.SEARCH + "&page=" + i);
    result.push(...page.pageProps.searchResult.data);
    console.log("Done, page", i);
    await wait(1 * 1_000); // wait for 0.5 seconds to not spam their servers
  }
  const oldFiles = await readFile("./data/adala/files.json");

  diffAdala(oldFiles, result);
  console.log("Done, Saving data");
  await fs.writeFile(
    "./data/adala/themes.json",
    JSON.stringify(themes, null, 4)
  );
  await fs.writeFile(
    "./data/adala/law-types.json",
    JSON.stringify(types, null, 4)
  );
  await fs.writeFile(
    "./data/adala/sgg-latest-day.json",
    JSON.stringify(sggLatestDay, null, 4)
  );
  await fs.writeFile(
    "./data/adala/files.json",
    JSON.stringify(result, null, 4)
  );
};
export { adala };
