export type DisplayItem = {
  id: string;
  user: string;
  worker: number;
  workerName: string;
  xOffset: number;
  length: number;
};

export const getUserByYOffset = (
  items: DisplayItem[],
  worker: number
): string | null => {
  const item = items.find(({ worker: w }) => w === worker);
  return item ? item.user : null;
};
