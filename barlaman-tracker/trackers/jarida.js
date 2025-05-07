import fs from "fs/promises";
import { diffJarida } from "../differs.js";
import { readFile } from "../../utils.js";

const jarida = async () => {
  const types = {
    BO: "النشرة العامة",
    ECI: "نشرة الاتفاقيات الدولية",
  };
  const apiUrl = `http://www.sgg.gov.ma/arabe/DesktopModules/MVC/TableListBO/BO/AjaxMethod?_=${Date.now()}`;

  const fetchData = async (moduleId, tabId) => {
    const headers = {
      ModuleId: moduleId,
      TabId: tabId,
    };
    return await (await fetch(apiUrl, { headers })).json();
  };
  const parseDate = (date) =>
    Number(date.replaceAll("/", "").replaceAll("Date(", "").replace(")", ""));
  // change module keys names to shorter names
  const formatModule = (module) => {
    return {
      id: module.BoId,
      num: module.BoNum,
      date: parseDate(module.BoDate),
      url: module.BoUrl,
    };
  };
  const dataECI = (await fetchData(3110, 847)).map(formatModule);
  const dataBO = (await fetchData(3111, 847)).map(formatModule);
  console.log("Downloaded jarida for all types (BO,ECI)");

  const path = "./data/jarida/";
  const oldDataBo = await readFile(path.concat("BO.json"));
  const oldDataECI = await readFile(path.concat("ECI.json"));
  diffJarida(oldDataBo, { type: types["BO"], data: dataBO });
  diffJarida(oldDataECI, { type: types["ECI"], data: dataECI });
  await fs.writeFile(
    path.concat(`BO.json`),
    JSON.stringify(
      {
        type: `${types["BO"]} (BO)`,
        data: dataBO,
      },
      null,
      4
    )
  );
  await fs.writeFile(
    path.concat(`ECI.json`),
    JSON.stringify(
      {
        type: `${types["ECI"]} (ECI)`,
        data: dataECI,
      },
      null,
      4
    )
  );
};

export { jarida };
