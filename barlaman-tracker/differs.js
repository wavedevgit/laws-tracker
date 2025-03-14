import { sendUpdates } from "../utils.js";

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
  await sendUpdates({ category: "jarida", type: b.type, diff });
};
const diffAdala = async (a, b) => {
  if (a.length === b.length) return;
  const diff = { added: [], removed: [] };
  const aSet = new Set(a.map((item) => JSON.stringify(item)));
  const bSet = new Set(b.map((item) => JSON.stringify(item)));

  for (let item of b) {
    if (!aSet.has(JSON.stringify(item))) {
      diff.added.push(item);
    }
  }
  for (let item of a) {
    if (!bSet.has(JSON.stringify(item))) {
      diff.removed.push(item);
    }
  }
  await sendUpdates({ category: "adala", diff });
  return;
};

export { diffJarida, diffAdala };
