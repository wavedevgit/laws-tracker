import { sendUpdates } from '../utils.js';

// differ for the data
const diffJarida = async (a, b) => {
    const diff = { added: [] };
    for (let i of b.data) {
        // added
        if (!a?.data?.some?.((item) => item.id === i.id)) {
            diff.added.push(i);
        }
    }
    if (!diff.added.length) return;
    await sendUpdates({ category: 'jarida', type: b.type, diff });
};

export { diffJarida };
