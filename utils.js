import fs from 'fs/promises';
export async function readFile(path) {
    try {
        return JSON.parse(await fs.readFile(path, 'utf-8'));
    } catch {
        return {};
    }
}

let sendUpdates = () => null;
let onReady = () => null;
const whenReady = (action) => {
    onReady = action;
};

export { sendUpdates, whenReady };
