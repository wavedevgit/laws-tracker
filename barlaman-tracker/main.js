/**
 * This tracks the most important sections on "sgg.gov.ma" and "chambredesrepresentants.ma" website
 * Hopefully you find this useful
 */

import fs from 'fs/promises';
import rsstojson from 'rss-to-json';
import { diffJarida } from './differs.js';
import { readFile } from '../utils.js';
const { parse } = rsstojson;

const jarida = async () => {
    const types = {
        BO: 'النشرة العامة',
        ECI: 'نشرة الاتفاقيات الدولية',
    };
    const apiUrl = `http://www.sgg.gov.ma/arabe/DesktopModules/MVC/TableListBO/BO/AjaxMethod?_=${Date.now()}`;

    const fetchData = async (moduleId, tabId) => {
        const headers = {
            ModuleId: moduleId,
            TabId: tabId,
        };
        return await (await fetch(apiUrl, { headers })).json();
    };
    const parseDate = (date) => Number(date.replaceAll('/', '').replaceAll('Date(', '').replace(')', ''));
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
    console.log('Downloaded jarida for all types (BO,ECI)');

    const path = './data/barlaman/jarida/';
    const oldDataBo = await readFile(path.concat('BO.json'));
    const oldDataECI = await readFile(path.concat('ECI.json'));
    diffJarida(oldDataBo, { type: types['BO'], data: dataBO });
    diffJarida(oldDataECI, { type: types['ECI'], data: dataECI });
    await fs.writeFile(
        path.concat(`BO.json`),
        JSON.stringify(
            {
                type: `${types['BO']} (BO)`,
                data: dataBO,
            },
            null,
            4,
        ),
    );
    await fs.writeFile(
        path.concat(`ECI.json`),
        JSON.stringify(
            {
                type: `${types['ECI']} (ECI)`,
                data: dataECI,
            },
            null,
            4,
        ),
    );
};
const rss = async () => {
    const types = ['news', 'evenements-archives', 'legislation/loi-discussion-assemblee'];
    const path = './data/barlaman/feed/';
    for (let type of types) {
        console.log('Downloaded rss feed for category:', type);
        const feed = await parse(`https://www.chambredesrepresentants.ma/ar/${type}/rss`);
        await fs.writeFile(path.concat(type.replace('/', '_'), '.json'), JSON.stringify(feed, null, 4));
    }
};

// download data
await jarida();
await rss();
