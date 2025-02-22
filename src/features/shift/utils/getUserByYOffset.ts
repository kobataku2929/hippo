export type DisplayItem = {
  id: string;
  user: string;
  workerName: string;
  xOffset: number;
  yOffset: number;
  length: number;
};

export const getUserByYOffset = (
  items: DisplayItem[],
  newYOffset: number
): string | null => {
  const item = items.find(({ yOffset }) => yOffset === newYOffset);
  return item ? item.user : null;
};
