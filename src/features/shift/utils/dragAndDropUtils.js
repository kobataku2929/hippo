export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const mergeRefs = (...refs) => {
  return (node) => {
    for (const ref of refs) {
      ref.current = node;
    }
  };
};

export const groupBy = (items, key) =>
  items?.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );
