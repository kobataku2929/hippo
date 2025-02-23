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

export const createUserYOffsetMaps = (workers) => {
  // `user_id` のユニークなリストを取得し、ソート
  const uniqueUsers = [...new Set(workers.map((obj) => obj.id))].sort();

  // `user_id` → `yOffset`
  const userToYOffsetMap = Object.fromEntries(
    uniqueUsers.map((user, i) => [user, i])
  );

  // `yOffset` → `user_id`
  const yOffsetToUserMap = Object.fromEntries(
    uniqueUsers.map((user, i) => [i, user])
  );

  return { userToYOffsetMap, yOffsetToUserMap };
};
