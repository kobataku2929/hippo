export type DisplayItem = {
  id: string;
  user: number;
  workerName: string;
  xOffset: number;
  yOffset: number;
  length: number;
};

export const getUserByYOffset = (
  items: DisplayItem[],
  newYOffset: number
): number | null => {
  console.log(items[0].user, "オラk");
  const item = items.find(({ yOffset }) => yOffset === newYOffset);
  return item ? item.user : null;
};
