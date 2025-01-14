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
    sendUpdates({ category: 'jarida', type: b.type, diff });
};
const diffFeed = (a, b, type) => {
    const diff = { removed: [], added: [] };
    for (let i of a?.items || []) {
        // removed
        if (!b.items.some((item) => item.id === i.id)) {
            diff.removed.push(i);
        }
    }
    for (let i of b.items) {
        // added
        if (!a?.items?.some?.((item) => item.id === i.id)) {
            diff.added.push(i);
        }
    }
    if (!diff.removed.length && !diff.added.length) return;
    sendUpdates({ category: 'barlaman-feed', type, diff });
};
export { diffFeed, diffJarida };
